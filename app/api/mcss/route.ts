import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://console.moritxius.nl/api/v2";
const API_KEY = process.env.MCSS_API_KEY!; // Lege diesen Wert als ENV-Variable an!

export async function POST(req: NextRequest) {
  try {
    const { endpoint, method = "GET", body } = await req.json();

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error?.toString() }, { status: 500 });
  }
}
