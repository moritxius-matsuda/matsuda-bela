import { NextRequest, NextResponse } from "next/server";
import { put, head } from "@vercel/blob";

async function readPosts() {
  const meta = await head("posts.json");
  if (!meta?.downloadUrl) return [];
  const res = await fetch(meta.downloadUrl, { cache: "no-store" });
  if (!res.ok) return [];
  return await res.json();
}

async function writePosts(posts: any[]) {
  await put("posts.json", JSON.stringify(posts, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function GET() {
  const posts = await readPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
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
}

export async function PUT(req: NextRequest) {
  const { id, title, content } = await req.json();
  const posts = await readPosts();
  const idx = posts.findIndex((p: any) => p.id === id);
  if (idx !== -1) {
    posts[idx] = { ...posts[idx], title, content };
    await writePosts(posts);
    return NextResponse.json(posts[idx]);
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  let posts = await readPosts();
  posts = posts.filter((p: any) => p.id !== id);
  await writePosts(posts);
  return NextResponse.json({ ok: true });
}
