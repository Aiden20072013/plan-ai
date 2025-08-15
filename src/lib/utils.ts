import { DbEvent } from "@/types/db-types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createTime(event: DbEvent) {
  const hour = Number(event.start_time.split(":")[0]);
  const minute = Number(event.start_time.split(":")[1]);

  const dateMs = new Date(event.date).getTime();
  const hourMs = hour * 60 * 60 * 1000;
  const minuteMs = minute * 60 * 1000;

  return dateMs + hourMs + minuteMs;
}