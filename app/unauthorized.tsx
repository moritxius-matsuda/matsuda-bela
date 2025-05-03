// app/unauthorized.tsx

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">401 - Unauthorized</h1>
      <p className="mb-4">
        Du hast keine Berechtigung, diese Seite zu sehen.<br />
        Wenn du Projektmitglied werden möchtest, schreibe bitte an <a href="mailto:moritz@moritxius.de" className="underline text-blue-500">moritz@moritxius.de</a>.
      </p>
      <Link href="/" className="mt-4 text-blue-500 hover:underline">
        Zurück zur Startseite
      </Link>
    </main>
  );
}
