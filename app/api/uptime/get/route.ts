// app/api/uptime/get/route.ts
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const site = searchParams.get("site");
  if (!site) return NextResponse.json({ error: "site required" }, { status: 400 });
  // Hole z.B. die letzten 8640 Einträge (letzte 12 Stunden)
  const data = await redis.lrange(`uptime:${site}`, 0, 8639);
  const parsed = data.map((item: string) => JSON.parse(item));
  return NextResponse.json(parsed);
}
