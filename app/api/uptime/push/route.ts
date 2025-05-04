// app/api/uptime/push/route.ts
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  const { site, status, responseTime } = await req.json();
  const entry = {
    timestamp: Date.now(),
    status,
    responseTime,
  };
  await redis.lpush(`uptime:${site}`, JSON.stringify(entry));
  // Optional: Liste auf 518400 Einträge beschränken (30 Tage à 5s)
  await redis.ltrim(`uptime:${site}`, 0, 518399);
  return NextResponse.json({ ok: true });
}
