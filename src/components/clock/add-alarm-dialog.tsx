"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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

interface AddAlarmDialogProps {
  onAdd: (time: string, label: string) => void;
}

type Period = "AM" | "PM";

function to24Hour(hour12: number, minute: number, period: Period) {
  const hour = (hour12 % 12) + (period === "PM" ? 12 : 0);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function AddAlarmDialog({ onAdd }: AddAlarmDialogProps) {
  const [open, setOpen] = useState(false);
  const [hour12, setHour12] = useState(7);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<Period>("AM");
  const [label, setLabel] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(to24Hour(hour12, minute, period), label.trim() || "Alarma");
    setLabel("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="icon" aria-label="Nueva alarma" />}>
        <Plus className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nueva alarma</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="alarm-hour">Hora</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="alarm-hour"
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
                  id="alarm-minute"
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
              <Label htmlFor="alarm-label">Etiqueta</Label>
              <Input
                id="alarm-label"
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
              Guardar alarma
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
