"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "reloj:name";

export function useUserName() {
  const [name, setName] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage only readable after mount
      setName(stored);
    }
  }, []);

  const updateName = useCallback((value: string) => {
    const trimmed = value.trim();
    setName(trimmed);
    window.localStorage.setItem(STORAGE_KEY, trimmed);
  }, []);

  return { name, updateName };
}
