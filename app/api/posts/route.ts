import { NextRequest, NextResponse } from "next/server";
import { put, head } from "@vercel/blob";

async function readPosts() {
  try {
    const meta = await head("posts.json"); // liefert Metadaten, inkl. downloadUrl
    if (!meta?.downloadUrl) return [];
    const res = await fetch(meta.downloadUrl);
    if (!res.ok) return [];
    return await res.json(); // oder .text(), je nach Inhalt
  } catch {
    return [];
  }
}


// Hilfsfunktion: Posts ins Blob schreiben
async function writePosts(posts: any[]) {
  // Schreibe als Text-Blob, überschreibe immer
  await put("posts.json", JSON.stringify(posts, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function GET() {
  const posts = await readPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();
    const posts = await readPosts();
    const newPost = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    posts.push(newPost);
    await writePosts(posts);
    return NextResponse.json(newPost);
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: error?.toString() }, { status: 500 });
  }
}
