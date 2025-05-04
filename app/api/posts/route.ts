import { NextRequest, NextResponse } from "next/server";
import { put, head } from "@vercel/blob";

// Hilfsfunktion: Beiträge lesen
async function readPosts() {
  try {
    const meta = await head("posts.json");
    if (!meta?.downloadUrl) return [];
    const res = await fetch(meta.downloadUrl, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("readPosts error:", error);
    return [];
  }
}

// Hilfsfunktion: Beiträge schreiben
async function writePosts(posts: any[]) {
  try {
    await put("posts.json", JSON.stringify(posts, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
  } catch (error) {
    console.error("writePosts error:", error);
    throw error;
  }
}

// GET: Alle Beiträge abrufen
export async function GET() {
  try {
    const posts = await readPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: error?.toString() }, { status: 500 });
  }
}

// POST: Neuen Beitrag speichern
export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ error: "Titel und Inhalt sind erforderlich." }, { status: 400 });
    }
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

// PUT: Beitrag bearbeiten
export async function PUT(req: NextRequest) {
  try {
    const { id, title, content } = await req.json();
    if (!id || !title || !content) {
      return NextResponse.json({ error: "ID, Titel und Inhalt sind erforderlich." }, { status: 400 });
    }
    const posts = await readPosts();
    const idx = posts.findIndex((p: any) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Beitrag nicht gefunden." }, { status: 404 });
    }
    posts[idx] = { ...posts[idx], title, content };
    await writePosts(posts);
    return NextResponse.json(posts[idx]);
  } catch (error) {
    console.error("PUT /api/posts error:", error);
    return NextResponse.json({ error: error?.toString() }, { status: 500 });
  }
}

// DELETE: Beitrag löschen
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID ist erforderlich." }, { status: 400 });
    }
    let posts = await readPosts();
    const before = posts.length;
    posts = posts.filter((p: any) => p.id !== id);
    if (posts.length === before) {
      return NextResponse.json({ error: "Beitrag nicht gefunden." }, { status: 404 });
    }
    await writePosts(posts);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/posts error:", error);
    return NextResponse.json({ error: error?.toString() }, { status: 500 });
  }
}
