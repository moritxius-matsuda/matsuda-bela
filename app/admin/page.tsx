import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminClientPage from "./AdminClientPage";

const ACCESS_KEYS = ["admin"];

export default async function AdminPage() {
  const user = await currentUser();

  // Hole die publicMetadata als Objekt
  const meta = user?.publicMetadata as Record<string, any> | undefined;

  // Prüfe, ob einer der ACCESS_KEYS auf 1 steht
  const hasAccess = meta && ACCESS_KEYS.some(key => meta[key] === 1);

  if (!user || !hasAccess) {
    redirect("/unauthorized");
  }

  return <AdminClientPage />;
}
