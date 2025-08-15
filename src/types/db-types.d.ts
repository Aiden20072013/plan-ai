export type Profile = {
    id: string,
    updated_at: Date | null,
    username: string | null,
    full_name: string | null,
    avatar_url: string | null,
    main_schedule_id: string | null,
}

export type Schedule = {
    id: string,
    created_at: Date,
    updated_at: Date | null,
    profile_id: string
}

export type Goal = {
    id: string,
    created_at: Date,
    user_id: string,
    text: string,
}

export type GenerateEvent = {
    date: string,
    startTime: string,
    endTime: string,
    activity: string   
}

export type DbEvent = {
    id: string,
    created_at: Date,
    start_time: string,
    end_time: string,
    schedule_id: string,
    activity: string,
    user_id: string,
    date: Date,
    completed: boolean | null
}

export type GoalLog = {
    id: string,
    created_at: Date,
    text: string,
    user_id: string,
    goal_id: string
}