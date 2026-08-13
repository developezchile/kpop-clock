"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Alarm } from "@/types/alarm";

const STORAGE_KEY = "reloj:alarms";

function getNextAlarmDate(alarms: Alarm[], now: Date): { alarm: Alarm; date: Date } | null {
  let next: { alarm: Alarm; date: Date } | null = null;

  for (const alarm of alarms) {
    if (!alarm.enabled) continue;
    const [hours, minutes] = alarm.time.split(":").map(Number);
    const date = new Date(now);
    date.setHours(hours, minutes, 0, 0);
    if (date <= now) date.setDate(date.getDate() + 1);
    if (!next || date < next.date) next = { alarm, date };
  }

  return next;
}

function loadAlarms(): Alarm[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Alarm[]) : [];
  } catch {
    return [];
  }
}

export function useAlarms(now: Date | null) {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const firedRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    setAlarms(loadAlarms());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }, [alarms, hydrated]);

  useEffect(() => {
    if (!now) return;
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const current = `${hh}:${mm}`;
    const dateKey = now.toDateString();

    for (const alarm of alarms) {
      if (!alarm.enabled || alarm.time !== current) continue;
      if (firedRef.current.get(alarm.id) === dateKey) continue;
      firedRef.current.set(alarm.id, dateKey);
      setRingingAlarm(alarm);
    }
  }, [now, alarms]);

  const addAlarm = useCallback((time: string, label: string) => {
    setAlarms((prev) => [
      ...prev,
      { id: crypto.randomUUID(), time, label, enabled: true },
    ].sort((a, b) => a.time.localeCompare(b.time)));
  }, []);

  const removeAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAlarm = useCallback((id: string, time: string, label: string) => {
    setAlarms((prev) =>
      prev
        .map((a) => (a.id === id ? { ...a, time, label } : a))
        .sort((a, b) => a.time.localeCompare(b.time))
    );
  }, []);

  const toggleAlarm = useCallback((id: string, enabled: boolean) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled } : a))
    );
  }, []);

  const dismissRingingAlarm = useCallback(() => {
    setRingingAlarm(null);
  }, []);

  const snoozeRingingAlarm = useCallback(
    (minutes: number) => {
      if (!ringingAlarm || !now) return;
      const snoozeDate = new Date(now.getTime() + minutes * 60_000);
      const hh = String(snoozeDate.getHours()).padStart(2, "0");
      const mm = String(snoozeDate.getMinutes()).padStart(2, "0");
      firedRef.current.delete(ringingAlarm.id);
      setAlarms((prev) =>
        prev.map((a) =>
          a.id === ringingAlarm.id ? { ...a, time: `${hh}:${mm}` } : a
        )
      );
      setRingingAlarm(null);
    },
    [ringingAlarm, now]
  );

  const nextAlarm = useMemo(
    () => (now ? getNextAlarmDate(alarms, now) : null),
    [alarms, now]
  );

  return {
    alarms,
    addAlarm,
    removeAlarm,
    updateAlarm,
    toggleAlarm,
    ringingAlarm,
    dismissRingingAlarm,
    snoozeRingingAlarm,
    nextAlarm,
  };
}
