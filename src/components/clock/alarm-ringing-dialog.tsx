"use client";

import { useEffect, useRef } from "react";
import { AlarmClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlarmSound } from "@/lib/alarm-sound";
import { formatTime12 } from "@/lib/utils";
import type { Alarm } from "@/types/alarm";

interface AlarmRingingDialogProps {
  alarm: Alarm | null;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
  useSong: boolean;
}

export function AlarmRingingDialog({
  alarm,
  onDismiss,
  onSnooze,
  useSong,
}: AlarmRingingDialogProps) {
  const soundRef = useRef<AlarmSound | null>(null);

  useEffect(() => {
    if (!alarm) return;
    const sound = new AlarmSound(useSong);
    soundRef.current = sound;
    sound.start();
    return () => {
      sound.stop();
      soundRef.current = null;
    };
  }, [alarm, useSong]);

  return (
    <Dialog open={!!alarm} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="border-white/10 bg-zinc-950 text-center sm:max-w-sm"
      >
        <DialogHeader className="items-center">
          <div className="mb-2 flex size-14 animate-bounce items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <AlarmClock className="size-7" />
          </div>
          <DialogTitle className="text-2xl">
            {alarm?.label ?? "Alarma"}
          </DialogTitle>
          <p className="text-4xl font-semibold tabular-nums text-white">
            {alarm ? formatTime12(alarm.time) : ""}
          </p>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-2">
          <Button size="lg" onClick={onDismiss}>
            Detener
          </Button>
          <Button size="lg" variant="secondary" onClick={() => onSnooze(5)}>
            Posponer 5 min
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
