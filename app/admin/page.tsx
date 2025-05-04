import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminClientPage from "./AdminClientPage";

const ALLOWED_ROLES = ["admin"];

export default async function AdminPage() {
  const user = await currentUser();

  // Hole das Rollen-Array aus publicMetadata
  const userRoles = user?.publicMetadata?.roles as string[] | undefined;

  // Prüfe, ob mindestens eine erlaubte Rolle vorhanden ist
  const hasAccess = userRoles?.some(role => ALLOWED_ROLES.includes(role));

  if (!user || !hasAccess) {
    redirect("/unauthorized");
  }

  return <AdminClientPage />;
}
