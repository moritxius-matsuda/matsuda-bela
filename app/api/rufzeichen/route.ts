import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic"; // für Edge/Serverless

export async function POST(req: NextRequest) {
  const { rufzeichen } = await req.json();

  // Schritt 1: Initial GET, um Hidden-Felder zu holen
  const getRes = await fetch("https://ans.bundesnetzagentur.de/amateurfunk/Rufzeichen.aspx", {
    headers: { "User-Agent": "Mozilla/5.0" },
    cache: "no-store",
  });
  const html = await getRes.text();
  const $ = cheerio.load(html);

  function getValue(name: string) {
    return $(`input[name="${name}"]`).val() as string;
  }

  // Schritt 2: POST mit Suchdaten
  const formData = new URLSearchParams();
  formData.append("__EVENTTARGET", getValue("__EVENTTARGET") ?? "");
  formData.append("__VIEWSTATE", getValue("__VIEWSTATE") ?? "");
  formData.append("__VIEWSTATEGENERATOR", getValue("__VIEWSTATEGENERATOR") ?? "");
  formData.append("__EVENTVALIDATION", getValue("__EVENTVALIDATION") ?? "");
  formData.append("Text1", rufzeichen);
  formData.append("Bt_Suche", "Suche starten");

  const postRes = await fetch("https://ans.bundesnetzagentur.de/amateurfunk/Rufzeichen.aspx", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0",
    },
    body: formData.toString(),
  });
  const postHtml = await postRes.text();
  const $$ = cheerio.load(postHtml);

  try {
    const row = $$('#DG_RZ tr').eq(1);
    if (!row.length) return NextResponse.json({ error: "Rufzeichen nicht gefunden" }, { status: 404 });
    const tds = row.find("td").map((_, el) => $$(el).text().trim()).get();
    if (tds.length < 5) return NextResponse.json({ error: "Rufzeichen nicht gefunden" }, { status: 404 });
    const [rufzeichen, klasse, , inhaber, betriebsort] = tds;
    return NextResponse.json({ rufzeichen, klasse, inhaber, betriebsort });
  } catch (e) {
    return NextResponse.json({ error: "Rufzeichen nicht gefunden" }, { status: 404 });
  }
}
