import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ConsoleClient from "./ConsoleClient";

export default async function ConsolePage() {
  const user = await currentUser();

  if (!user || user.publicMetadata.role !== "console") {
    redirect("/unauthorized");
  }

  return <ConsoleClient />;
}
