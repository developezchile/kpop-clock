"use client";

import { AlarmClock, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { formatTime12 } from "@/lib/utils";
import type { Alarm } from "@/types/alarm";
import { EditAlarmDialog } from "@/components/clock/edit-alarm-dialog";

interface AlarmListProps {
  alarms: Alarm[];
  onToggle: (id: string, enabled: boolean) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, time: string, label: string) => void;
}

export function AlarmList({ alarms, onToggle, onRemove, onEdit }: AlarmListProps) {
  if (alarms.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-10 text-center text-white/40">
        <AlarmClock className="size-6" />
        <p className="text-sm">Sin alarmas todavía</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <ul className="flex flex-col gap-2 pr-2">
        {alarms.map((alarm) => (
          <li
            key={alarm.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
          >
            <div className="flex min-w-0 flex-col">
              <span
                className={`text-xl font-semibold tabular-nums ${
                  alarm.enabled ? "text-white" : "text-white/40"
                }`}
              >
                {formatTime12(alarm.time)}
              </span>
              <span className="truncate text-xs text-white/50">
                {alarm.label}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Switch
                checked={alarm.enabled}
                onCheckedChange={(checked) => onToggle(alarm.id, checked)}
                aria-label={`Activar alarma ${alarm.time}`}
              />
              <EditAlarmDialog alarm={alarm} onSave={onEdit} />
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-white/40 hover:text-red-400"
                onClick={() => onRemove(alarm.id)}
                aria-label={`Eliminar alarma ${alarm.time}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
