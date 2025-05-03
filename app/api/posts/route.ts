import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const postsFile = path.join(process.cwd(), "posts.json");

function readPosts() {
  const data = fs.readFileSync(postsFile, "utf8");
  return JSON.parse(data);
}

function writePosts(posts: any) {
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), "utf8");
}

export async function GET() {
  const posts = readPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();
  const posts = readPosts();
  const newPost = {
    id: Date.now(),
    title,
    content,
    createdAt: new Date().toISOString(),
  };
  posts.push(newPost);
  writePosts(posts);
  return NextResponse.json(newPost);
}

export async function PUT(req: NextRequest) {
  const { id, title, content } = await req.json();
  const posts = readPosts();
  const idx = posts.findIndex((p: any) => p.id === id);
  if (idx !== -1) {
    posts[idx] = {
      ...posts[idx],
      title,
      content,
      // createdAt bleibt unverändert
    };
    writePosts(posts);
    return NextResponse.json(posts[idx]);
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  let posts = readPosts();
  posts = posts.filter((p: any) => p.id !== id);
  writePosts(posts);
  return NextResponse.json({ ok: true });
}
