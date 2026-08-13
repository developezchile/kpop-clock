"use client";

import { Snowflake, Sun, Cloud } from "lucide-react";
import { useWeather } from "@/hooks/use-weather";

const COLD_MAX = 14;
const WARM_MIN = 25;

function getWeatherInfo(temperature: number) {
  if (temperature <= COLD_MAX) {
    return { label: "Frío", Icon: Snowflake, color: "text-sky-300" };
  }
  if (temperature >= WARM_MIN) {
    return { label: "Calor", Icon: Sun, color: "text-amber-300" };
  }
  return { label: "Templado", Icon: Cloud, color: "text-emerald-300" };
}

export function WeatherWidget() {
  const { temperature } = useWeather();

  if (temperature === null) return null;

  const { label, Icon, color } = getWeatherInfo(temperature);

  return (
    <div className="mb-2 flex items-center gap-1.5 [@media(orientation:landscape)]:mb-3">
      <Icon className={`size-6 [@media(orientation:landscape)]:size-7 ${color}`} />
      <span className="text-2xl font-bold text-white/90 [@media(orientation:landscape)]:text-3xl">
        {Math.round(temperature)}°C
      </span>
      <span className="text-sm font-medium text-white/50 [@media(orientation:landscape)]:text-base">
        {label}
      </span>
    </div>
  );
}
