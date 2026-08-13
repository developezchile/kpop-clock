"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ENABLED_KEY = "reloj:wallpaper-enabled";
const CACHE_KEY = "reloj:wallpaper-cache";
const INDEX_KEY = "reloj:wallpaper-index";

interface WallpaperCache {
  url: string;
  photographer: string;
  photographerUrl: string;
  fetchedAt: number;
}

function readCache(): WallpaperCache | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as WallpaperCache) : null;
  } catch {
    return null;
  }
}

function nextIndex() {
  const current = Number(window.localStorage.getItem(INDEX_KEY));
  const next = Number.isFinite(current) && current > 0 ? current + 1 : 1;
  window.localStorage.setItem(INDEX_KEY, String(next));
  return next;
}

export function useWallpaper() {
  const [enabled, setEnabled] = useState(false);
  const [wallpaper, setWallpaper] = useState<WallpaperCache | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallpaper = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const index = nextIndex();
      const res = await fetch(`/api/wallpaper?index=${index}`);
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      const next: WallpaperCache = {
        url: data.url,
        photographer: data.photographer,
        photographerUrl: data.photographerUrl,
        fetchedAt: Date.now(),
      };
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      setWallpaper(next);
    } catch {
      setError("No se pudo cargar el fondo");
    } finally {
      setLoading(false);
    }
  }, []);

  const hasFetchedOnMount = useRef(false);

  useEffect(() => {
    const storedEnabled = window.localStorage.getItem(ENABLED_KEY) === "true";
    const cached = readCache();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- persisted state only readable after mount
    setEnabled(storedEnabled);
    if (cached) {
      setWallpaper(cached);
    }
    if (storedEnabled && !hasFetchedOnMount.current) {
      hasFetchedOnMount.current = true;
      fetchWallpaper();
    }
  }, [fetchWallpaper]);

  const toggleWallpaper = useCallback(
    (next: boolean) => {
      setEnabled(next);
      window.localStorage.setItem(ENABLED_KEY, String(next));
      if (next) {
        fetchWallpaper();
      }
    },
    [fetchWallpaper]
  );

  return { enabled, toggleWallpaper, wallpaper, loading, error };
}
