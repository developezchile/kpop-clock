"use client";

import { useState } from "react";
import { AlarmClock } from "lucide-react";
import { useClock } from "@/hooks/use-clock";
import { useAlarms } from "@/hooks/use-alarms";
import { useUserName } from "@/hooks/use-user-name";
import { useWallpaper } from "@/hooks/use-wallpaper";
import { useAlarmSoundSetting } from "@/hooks/use-alarm-sound-setting";
import { ClockDisplay } from "@/components/clock/clock-display";
import { AlarmList } from "@/components/clock/alarm-list";
import { AddAlarmDialog } from "@/components/clock/add-alarm-dialog";
import { AlarmRingingDialog } from "@/components/clock/alarm-ringing-dialog";
import { SettingsDialog } from "@/components/clock/settings-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const now = useClock();
  const { name, updateName } = useUserName();
  const {
    enabled: wallpaperEnabled,
    toggleWallpaper,
    wallpaper,
  } = useWallpaper();
  const { useSong, toggleUseSong } = useAlarmSoundSetting();
  const {
    alarms,
    addAlarm,
    removeAlarm,
    updateAlarm,
    toggleAlarm,
    ringingAlarm,
    dismissRingingAlarm,
    snoozeRingingAlarm,
    nextAlarm,
  } = useAlarms(now);
  const [showAlarms, setShowAlarms] = useState(false);
  const showWallpaper = wallpaperEnabled && !!wallpaper;

  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-zinc-900 bg-cover bg-center p-4 text-white [@media(orientation:landscape)]:p-6"
      style={showWallpaper ? { backgroundImage: `url(${wallpaper.url})` } : undefined}
    >
      {showWallpaper && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/55 to-black/75" />
      )}

      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 [@media(orientation:landscape)]:top-6 [@media(orientation:landscape)]:right-auto [@media(orientation:landscape)]:left-6">
        <Button
          variant="ghost"
          size="icon"
          className={`text-white/50 hover:text-white ${showAlarms ? "text-white" : ""}`}
          aria-label={showAlarms ? "Ocultar alarmas" : "Mostrar alarmas"}
          aria-pressed={showAlarms}
          onClick={() => setShowAlarms((prev) => !prev)}
        >
          <AlarmClock className="size-5" />
        </Button>
        <SettingsDialog
          name={name}
          onSave={updateName}
          wallpaperEnabled={wallpaperEnabled}
          onToggleWallpaper={toggleWallpaper}
          alarmSongEnabled={useSong}
          onToggleAlarmSong={toggleUseSong}
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col gap-4 [@media(orientation:landscape)]:flex-row [@media(orientation:landscape)]:items-stretch [@media(orientation:landscape)]:gap-6">
        <ClockDisplay now={now} name={name} nextAlarm={nextAlarm} />

        {showAlarms && (
          <>
            <Separator className="my-1 bg-white/10 [@media(orientation:landscape)]:my-0 [@media(orientation:landscape)]:h-auto [@media(orientation:landscape)]:w-px" />

            <div className="flex min-h-0 flex-1 flex-col gap-3 [@media(orientation:landscape)]:max-w-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
                  Alarmas
                </h2>
                <AddAlarmDialog onAdd={addAlarm} />
              </div>
              <AlarmList
                alarms={alarms}
                onToggle={toggleAlarm}
                onRemove={removeAlarm}
                onEdit={updateAlarm}
              />
            </div>
          </>
        )}
      </div>

      {showWallpaper && (
        <a
          href={wallpaper.photographerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 text-[10px] text-white/40 hover:text-white/70"
        >
          Foto de {wallpaper.photographer} en Pexels
        </a>
      )}

      <AlarmRingingDialog
        alarm={ringingAlarm}
        onDismiss={dismissRingingAlarm}
        onSnooze={snoozeRingingAlarm}
        useSong={useSong}
      />
    </div>
  );
}
