export default function UnauthorizedPage() {
  return (
    <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", color: "var(--red-7)" }}>Kein Zugriff</h1>
        <p style={{ color: "var(--color-muted)", marginTop: 16 }}>
          Du bist nicht berechtigt, diese Seite zu sehen.<br />
          <a href="/" style={{ color: "var(--color-primary)" }}>Zurück zur Startseite</a>
        </p>
      </div>
    </main>
  );
}
