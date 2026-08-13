import { NextResponse } from "next/server";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const PAGE_RANGE = 100;

function getMondayWeekIndex(date: Date) {
  const day = date.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - diffToMonday);
  return Math.floor(monday.getTime() / WEEK_MS);
}

export async function GET(request: Request) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "PEXELS_API_KEY no configurada" },
      { status: 500 }
    );
  }

  const requestedIndex = Number(new URL(request.url).searchParams.get("index"));
  const weekIndex = Number.isFinite(requestedIndex) && requestedIndex > 0
    ? requestedIndex
    : getMondayWeekIndex(new Date());
  const page = (weekIndex % PAGE_RANGE) + 1;
  
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=kpop&orientation=landscape&per_page=1&page=${page}`,
    {
      headers: { Authorization: apiKey },
      next: { revalidate: 60 * 60 * 24 },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Error al consultar Pexels" }, { status: 502 });
  }

  const data = await res.json();
  const photo: {
    id: number;
    photographer: string;
    photographer_url: string;
    src: { large2x?: string; large: string };
  } | undefined = data.photos?.[0];

  if (!photo) {
    return NextResponse.json({ error: "Sin resultados" }, { status: 404 });
  }

  return NextResponse.json({
    url: photo.src.large2x ?? photo.src.large,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    id: photo.id,
    weekIndex,
  });
}
