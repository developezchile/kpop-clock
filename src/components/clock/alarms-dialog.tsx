"use client";

import { AlarmClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlarmList } from "@/components/clock/alarm-list";
import { AddAlarmDialog } from "@/components/clock/add-alarm-dialog";
import type { Alarm } from "@/types/alarm";

interface AlarmsDialogProps {
  alarms: Alarm[];
  onToggle: (id: string, enabled: boolean) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, time: string, label: string) => void;
  onAdd: (time: string, label: string) => void;
}

export function AlarmsDialog({
  alarms,
  onToggle,
  onRemove,
  onEdit,
  onAdd,
}: AlarmsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-white/50 hover:text-white"
            aria-label="Alarmas"
          />
        }
      >
        <AlarmClock className="size-5" />
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-sm">
        <DialogHeader className="flex-row items-center justify-between pr-8 space-y-0">
          <DialogTitle>Alarmas</DialogTitle>
          <AddAlarmDialog onAdd={onAdd} />
        </DialogHeader>
        <AlarmList
          alarms={alarms}
          onToggle={onToggle}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      </DialogContent>
    </Dialog>
  );
}
