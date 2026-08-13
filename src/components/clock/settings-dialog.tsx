"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";

interface SettingsDialogProps {
  name: string;
  onSave: (name: string) => void;
  wallpaperEnabled: boolean;
  onToggleWallpaper: (enabled: boolean) => void;
  alarmSongEnabled: boolean;
  onToggleAlarmSong: (enabled: boolean) => void;
}

export function SettingsDialog({
  name,
  onSave,
  wallpaperEnabled,
  onToggleWallpaper,
  alarmSongEnabled,
  onToggleAlarmSong,
}: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(name);

  function handleOpenChange(next: boolean) {
    if (next) setValue(name);
    setOpen(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(value);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-white/50 hover:text-white"
            aria-label="Configuración"
          />
        }
      >
        <Settings className="size-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Configuración</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="user-name">Tu nombre</Label>
            <Input
              id="user-name"
              type="text"
              placeholder="Dominga"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={30}
            />
          </div>
          <div className="flex items-center justify-between gap-4 border-t pt-4">
            <div className="grid gap-0.5">
              <Label htmlFor="wallpaper-toggle">Imagen de fondo</Label>
              <p className="text-xs text-muted-foreground">
                Cambia cada vez que recargas la página
              </p>
            </div>
            <Switch
              id="wallpaper-toggle"
              checked={wallpaperEnabled}
              onCheckedChange={onToggleWallpaper}
            />
          </div>
          <div className="flex items-center justify-between gap-4 border-t pt-4">
            <div className="grid gap-0.5">
              <Label htmlFor="alarm-song-toggle">Canción de alarma</Label>
              <p className="text-xs text-muted-foreground">
                Reproduce una canción en vez del pitido
              </p>
            </div>
            <Switch
              id="alarm-song-toggle"
              checked={alarmSongEnabled}
              onCheckedChange={onToggleAlarmSong}
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
