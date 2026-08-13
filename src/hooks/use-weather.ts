"use client";

import { useEffect, useState } from "react";

const CACHE_KEY = "reloj:weather-cache";
const CACHE_TTL_MS = 30 * 60 * 1000;
const GEOLOCATION_TIMEOUT_MS = 5000;

interface WeatherCache {
  temperature: number;
  fetchedAt: number;
}

function readCache(): WeatherCache | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as WeatherCache;
    if (Date.now() - cached.fetchedAt > CACHE_TTL_MS) return null;
    return cached;
  } catch {
    return null;
  }
}

function getPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: GEOLOCATION_TIMEOUT_MS,
      maximumAge: CACHE_TTL_MS,
    });
  });
}

export function useWeather() {
  const [temperature, setTemperature] = useState<number | null>(null);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- persisted state only readable after mount
      setTemperature(cached.temperature);
      return;
    }

    if (!("geolocation" in navigator)) return;

    let cancelled = false;

    (async () => {
      try {
        const { coords } = await getPosition();
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m`
        );
        if (!res.ok) throw new Error("request failed");
        const data = await res.json();
        const temp = data.current?.temperature_2m;
        if (typeof temp !== "number" || cancelled) return;

        window.localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ temperature: temp, fetchedAt: Date.now() })
        );
        setTemperature(temp);
      } catch {
        // sin permiso de ubicación o sin conexión: el widget simplemente no aparece
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { temperature };
}
