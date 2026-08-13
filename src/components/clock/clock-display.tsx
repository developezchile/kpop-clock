"use client";

import { formatTime12 } from "@/lib/utils";
import type { Alarm } from "@/types/alarm";

interface ClockDisplayProps {
  now: Date | null;
  name: string;
  nextAlarm: { alarm: Alarm; date: Date } | null;
}

function getGreeting(hours: number, name: string) {
  const suffix = name ? `, ${name}` : "";
  if (hours < 12) return `Buenos días${suffix}`;
  if (hours < 20) return `Buenas tardes${suffix}`;
  return `Buenas noches${suffix}`;
}

function formatNextAlarm(nextAlarm: { alarm: Alarm; date: Date }, now: Date) {
  const { alarm, date } = nextAlarm;
  const diffMin = Math.max(0, Math.round((date.getTime() - now.getTime()) / 60_000));
  const hoursUntil = Math.floor(diffMin / 60);
  const minutesUntil = diffMin % 60;
  const relative = hoursUntil > 0 ? `${hoursUntil} h ${minutesUntil} min` : `${minutesUntil} min`;
  const dayLabel = date.toDateString() === now.toDateString() ? "hoy" : "mañana";

  return `Próxima alarma ${dayLabel} a las ${formatTime12(alarm.time)} · en ${relative}`;
}

export function ClockDisplay({ now, name, nextAlarm }: ClockDisplayProps) {
  if (!now) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <div className="h-[18vw] w-[70vw] max-w-2xl animate-pulse rounded-2xl bg-white/5 [@media(orientation:landscape)]:h-[20vh] [@media(orientation:landscape)]:w-[40vw]" />
      </div>
    );
  }

  const hours = String(now.getHours() % 12 === 0 ? 12 : now.getHours() % 12).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const period = now.getHours() >= 12 ? "PM" : "AM";

  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <p className="text-[4.5vw] font-medium text-emerald-400 font-[family-name:var(--font-geist)] [@media(orientation:landscape)]:text-[min(6.5vh,4.9vw)]">
        {getGreeting(now.getHours(), name)}
      </p>
      <div className="flex items-end gap-2 font-mono font-semibold tracking-tight tabular-nums text-white sm:gap-3">
        <span className="text-[18vw] leading-none [@media(orientation:landscape)]:text-[min(36vh,27vw)]">
          {hours}:{minutes}
        </span>
        <span className="mb-[1vw] flex flex-col items-start gap-1 text-[4vw] leading-none text-white/50 [@media(orientation:landscape)]:mb-[2.5vh] [@media(orientation:landscape)]:text-[min(8vh,6vw)]">
          <span>{seconds}</span>
          <span className="text-emerald-400">{period}</span>
        </span>
      </div>
      <p className="text-[4vw] font-medium capitalize text-white/60 [@media(orientation:landscape)]:text-[min(6vh,4.5vw)]">
        {dateLabel}
      </p>
      {nextAlarm && (
        <p className="text-[4vw] text-white/50 [@media(orientation:landscape)]:text-[min(5.5vh,4.1vw)]">
          {formatNextAlarm(nextAlarm, now)}
        </p>
      )}
    </div>
  );
}
