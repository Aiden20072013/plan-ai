import { ai } from "@/lib/ai";
import { formatDateWithYear } from "@/lib/formatters";
import { Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../actions";

export async function POST(req: NextRequest) {
    try {
        const [supabase, user] = await getAuthenticatedUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const reqBody = await req.json();

        if (!reqBody.goals || reqBody.goals.length === 0) {
            return NextResponse.json({ error: "Must select goals" }, { status: 400 });
        }

        let goalString = "";

        for (let i = 0; i < reqBody.goals.length; i++) {
            goalString += `${i + 1}. ${reqBody.goals[i].goalText}\n`
        }

        const prompt = `This is an app where a user has goals, and you use those goals to create a schedule to help reach those goals. The schedules cover a 7-day period. Generate a 7-day schedule to meet the goals of the user, which begins on ${formatDateWithYear(new Date())}. The user inputs their goals, and optional extra requests. You will output a list of events. Each event must have a date (in the format YEAR-MONTH-DAY with zeros if single digit), a start time (as a complete timestamp in the format year-month-dayThour:minute:secondZ), an end time(as a complete timestamp in the format year-month-dayThour:minute:secondZ), and the activity. The events should only be those that help the user achieve their goals, not unecessary additions such as 'rest time', unless that directly helps the user achieve their goal. Each day should have several events, unless it is a rest day, in which case it will have no events. Some events might be small, but large events, such as a workout, should be detailed and describe the exercises to be done and the rough number of sets and reps. The activities should include an emoji at the beginning, and sub-events within events, such as exercises, should also include emojis. If the event is large such as a workout, the activity string should be like a list, not a paragraph.  You must generate exactly 16 events. Here are the goals: ${goalString}. Here is the optional extra info: ${reqBody.extraInfo}`;

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
            throw new Error("Error creating schedule");
        }

        return NextResponse.json({ data: JSON.parse(response.text) });
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