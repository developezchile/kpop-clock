"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "reloj:alarm-song-enabled";

export function useAlarmSoundSetting() {
  const [useSong, setUseSong] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) === "true";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    setUseSong(stored);
  }, []);

  const toggleUseSong = useCallback((next: boolean) => {
    setUseSong(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
  }, []);

  return { useSong, toggleUseSong };
}
