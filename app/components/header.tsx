"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div className="p-4">Lade...</div>;
  if (!isSignedIn) return null; // Optional: zeige Login-Link oder nichts

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">Matsuda Béla</h1>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
