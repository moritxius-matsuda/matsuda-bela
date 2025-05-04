import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://console.moritxius.nl/api/v2";
const API_KEY = process.env.MCSS_API_KEY!; // Setze diesen Wert in deiner .env.local

export async function POST(req: NextRequest) {
  try {
    // Erwartet: { endpoint: string, method?: string, body?: any }
    const { endpoint, method = "GET", body } = await req.json();

    // Baue den Ziel-URL
    const url = `${API_URL}${endpoint}`;

    // Setze die Request-Optionen
    const options: RequestInit = {
      method,
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      // Nur bei POST/PUT/PATCH ein Body
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    };

    // Anfrage an die MCSS-API
    const res = await fetch(url, options);

    // Versuche, die Antwort als JSON zu lesen
    const data = await res.json();

    // Gib die Antwort weiter
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error?.toString() }, { status: 500 });
  }
}
