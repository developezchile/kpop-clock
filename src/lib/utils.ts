import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime12(time: string) {
  const [hh, mm] = time.split(":").map(Number)
  const period = hh >= 12 ? "PM" : "AM"
  const hour12 = hh % 12 || 12
  return `${hour12}:${String(mm).padStart(2, "0")} ${period}`
}
