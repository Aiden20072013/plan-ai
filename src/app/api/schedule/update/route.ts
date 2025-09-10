import { getAuthenticatedUser } from "@/app/actions";
import { ai } from "@/lib/ai";
import { formatDateWithYear } from "@/lib/formatters";
import { GenerateEvent } from "@/types/db-types";
import { Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const [supabase, user] = await getAuthenticatedUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Getting information needed to generate the new events
        // The extra info, the goals, and the previous events.
        const body = await req.json();

        if (!body.events) {
            return NextResponse.json({ error: "Events required" }, { status: 400 });
        }

        if (!body.schedule_id) {
            return NextResponse.json({ error: "Schedule required" }, { status: 400 });
        }

        // Gets the extra info of the schedule
        const { data: scheduleInfo, error: extraInfoError } = await supabase
            .from("schedules")
            .select("extra_info")
            .eq("id", body.schedule_id)
            .single();
        
        if (extraInfoError) {
            throw new Error(extraInfoError.message);
        }

        if (!scheduleInfo.extra_info) {
            throw new Error("Error fetching extra info");
        }

        const { data: goalIds, error } = await supabase
            .from("goal_schedule_join")
            .select("goal_id")
            .eq("schedule_id", body.schedule_id);
        
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!goalIds) {
            throw new Error("Error fetching goals");
        }
        
        // Creates a goal string of the goals to be inserted into the prompt

        const fetchGoalText = async (goalId: string) => {
            const { data: goal, error } = await supabase
                .from("goals")
                .select("text")
                .eq("id", goalId)
                .single()
            
            if (error) {
                throw new Error(error.message);
            }

            return goal.text;
        }

        const goalList = await Promise.all(goalIds.map(goal => fetchGoalText(goal.goal_id)));

        let goalString = "\n";

        goalList.forEach((goal, i) => {
            goalString += `${i + 1}. ${goal}\n`;
        })

        // Generate the new events with Gemini
        const prompt = `This is an app where a user has goals, and you use those goals to create a schedule to help reach those goals. The user sees 7 days of the schedule. They have already used the schedule. Generate 7 more days of the schedule to meet the goals of the user, which begins on ${formatDateWithYear(new Date())}. The new events should build on the old events. For example, if the goal is learning, the events need to increase in difficulty and introduce new topics, rather than repeating the same lessons. The user inputs their goals, and optional extra requests. You will output a list of events. Each event must have a date (in the format YEAR-MONTH-DAY with zeros if single digit), a start time (as a complete timestamp in the format year-month-dayThour:minute:secondZ), end time(as a complete timestamp in the format year-month-dayThour:minute:secondZ), and the activity. You must ALWAYS include a start time, end time and a date. The events should only be those that help the user achieve their goals, not unecessary additions such as 'rest time', unless that directly helps the user achieve their goal. Each day should have several events, unless it is a rest day, in which case it will have no events. Some events might be small, but large events, such as a workout, should be detailed and describe the exercises to be done and the rough number of sets and reps. The activities should include an emoji at the beginning, and sub-events within events, such as exercises, should also include emojis. If the event is large such as a workout, the activity string should be like a list, not a paragraph. Here are the events that the user previously had: ${body.events}. Make the new events consider the old events. You must generate exactly 16 events. Here are the goals: ${goalString}. Here is the optional extra info: ${scheduleInfo.extra_info}`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            date: {
                                type: Type.STRING
                            },
                            startTime: {
                                type: Type.STRING
                            },
                            endTime: {
                                type: Type.STRING
                            },
                            activity: {
                                type: Type.STRING
                            }
                        },
                        propertyOrdering: ["date", "startTime", "endTime", "activity"]
                    }
                }
            }
        })

        if (!response.text) {
            throw new Error("Error generating events");
        }

        const data = JSON.parse(response.text);

        // Makes the generated events compatible with the db
        const newEvents = data.map((event: GenerateEvent) => {
            return {
                start_time: new Date(event.startTime),
                end_time: new Date(event.endTime),
                schedule_id: body.schedule_id,
                activity: event.activity,
                user_id: user.id,
                date: new Date(event.date),
                completed: false
            }
        })

        // Inserts the new events into the db
        const { data: dbEvents, error: createError } = await supabase
            .from("events")
            .insert(newEvents)
            .select("*")
            .order("start_time", { ascending: true });
        
        if (createError) {
            return NextResponse.json({ error: createError.message }, { status: 500 });
        }

        return NextResponse.json(dbEvents);
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        } else if (typeof err === "string") {
            return NextResponse.json({ error: err }, { status: 500 });
        } else {
            return NextResponse.json({ error: "An error occurred" }, { status: 500 });
        }
    }
}