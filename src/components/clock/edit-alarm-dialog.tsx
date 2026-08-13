"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Alarm } from "@/types/alarm";

interface EditAlarmDialogProps {
  alarm: Alarm;
  onSave: (id: string, time: string, label: string) => void;
}

type Period = "AM" | "PM";

function to24Hour(hour12: number, minute: number, period: Period) {
  const hour = (hour12 % 12) + (period === "PM" ? 12 : 0);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function to12Hour(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const period: Period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return { hour12, minute, period };
}

export function EditAlarmDialog({ alarm, onSave }: EditAlarmDialogProps) {
  const initial = to12Hour(alarm.time);
  const [open, setOpen] = useState(false);
  const [hour12, setHour12] = useState(initial.hour12);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState<Period>(initial.period);
  const [label, setLabel] = useState(alarm.label);

  function handleOpenChange(next: boolean) {
    if (next) {
      const current = to12Hour(alarm.time);
      setHour12(current.hour12);
      setMinute(current.minute);
      setPeriod(current.period);
      setLabel(alarm.label);
    }
    setOpen(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(alarm.id, to24Hour(hour12, minute, period), label.trim() || "Alarma");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-white/40 hover:text-white"
            aria-label={`Editar alarma ${alarm.time}`}
          />
        }
      >
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar alarma</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-alarm-hour">Hora</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-alarm-hour"
                  type="number"
                  min={1}
                  max={12}
                  value={hour12}
                  onChange={(e) =>
                    setHour12(
                      Math.min(12, Math.max(1, Number(e.target.value) || 1))
                    )
                  }
                  required
                  className="text-lg tabular-nums"
                />
                <span className="text-lg text-muted-foreground">:</span>
                <Input
                  id="edit-alarm-minute"
                  type="number"
                  min={0}
                  max={59}
                  value={String(minute).padStart(2, "0")}
                  onChange={(e) =>
                    setMinute(
                      Math.min(59, Math.max(0, Number(e.target.value) || 0))
                    )
                  }
                  required
                  className="text-lg tabular-nums"
                />
                <Select
                  value={period}
                  onValueChange={(value) => setPeriod(value as Period)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-alarm-label">Etiqueta</Label>
              <Input
                id="edit-alarm-label"
                type="text"
                placeholder="Ej. Despertar"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                maxLength={40}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
