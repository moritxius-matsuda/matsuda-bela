import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TerminalPage from "./TerminalPage";

const ACCESS_KEYS = ["admin", "terminal"];

export default async function Terminal() {
  const user = await currentUser();

  // Hole das publicMetadata-Objekt
  const meta = user?.publicMetadata as Record<string, any> | undefined;

  // Prüfe, ob mindestens einer der ACCESS_KEYS auf 1 steht
  const hasAccess = meta && ACCESS_KEYS.some(key => meta[key] === 1);

  if (!user || !hasAccess) {
    redirect("/unauthorized");
  }

  return <TerminalPage />;
}
