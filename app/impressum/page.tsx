import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function ImpressumPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          display: "flex",
          gap: 6,
          alignItems: "flex-start",
          flexDirection: { xs: "column", md: "row" }, // mobil untereinander, ab md nebeneinander
        }}
      >
        {/* Linke Spalte: Impressum */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h4" gutterBottom>
            Impressum
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" paragraph>
              <strong>Anbieterkennzeichnung nach § 5 DDG:</strong><br />
              Andreas Meier<br />
              Am Weidengraben 65<br />
              54296 Trier<br />
              Deutschland
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Verantwortlich gemäß § 18 MStV:</strong><br />
              Andreas Meier
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Betrieben durch:</strong><br />
              Moritz Béla Meier, vertreten durch seinen gesetzlichen Vertreter Andreas Meier
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Kontakt:</strong><br />
              E-Mail: behoerde@moritxius.de<br />
              Telefon: +49 651 6860593
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Verbraucherstreitbeilegung/Universalschlichtungsstelle:</strong><br />
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Hinweis zur Online-Streitbeilegung gemäß Art. 14 Abs. 1 ODR-VO:</strong><br />
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter{" "}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
                https://ec.europa.eu/consumers/odr/
              </a>{" "}
              finden.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Urheberrechtlicher Hinweis:</strong><br />
              Die Inhalte dieser Website sind urheberrechtlich geschützt. Jegliche Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Haftungsausschluss:</strong><br />
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Änderungen:</strong><br />
              Wir behalten uns vor, dieses Impressum jederzeit zu ändern. Es gilt stets die zum Zeitpunkt des Besuchs unserer Website aktuelle Fassung.<br />
              <br />
              <strong>Stand:</strong> 04.05.2024
            </Typography>
          </Box>
        </Box>

        {/* Rechte Spalte: Datenschutzerklärung */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h4" gutterBottom>
            Datenschutzerklärung
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" paragraph>
              Diese Datenschutzerklärung erläutert Art, Umfang und Zweck der Erhebung und Verarbeitung personenbezogener Daten auf dieser Website. Verantwortlich ist der in Ihrem Impressum genannte Betreiber. Technische Umsetzung der Authentifizierung erfolgt über Clerk, das Hosting über Vercel. Nutzer können sich über Clerk registrieren, wofür Name, E‑Mail, Passwort und ggf. Google‑OAuth‑Daten verarbeitet werden. Die Erhebung von Server‑Logdaten dient der Sicherheit und Stabilität des Angebots. Betroffene Personen haben umfangreiche Rechte nach der DSGVO.
            </Typography>
            <Typography variant="h6" gutterBottom>
              1. Verantwortlicher
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Name/Firma:</strong> Moritz Béla Meier, vertreten durch seinen gesetzlichen Vertreter Andreas Meier<br />
              <strong>Anschrift:</strong> Am Weidengraben 65, 54296 Trier, Deutschland<br />
              <strong>Kontakt:</strong> E‑Mail: behoerde@moritxius.de, Telefon: +49 651 6860593
            </Typography>
            <Typography variant="h6" gutterBottom>
              2. Datenschutzbeauftragter
            </Typography>
            <Typography variant="body1" paragraph>
              Wir haben keinen Datenschutzbeauftragten benannt, da wir nicht gesetzlich dazu verpflichtet sind.
            </Typography>
            <Typography variant="h6" gutterBottom>
              3. Erhobene Daten und Verarbeitungszwecke
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              3.1 Registrierung und Nutzerverwaltung via Clerk
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Datenarten:</strong> Name, E‑Mail-Adresse, Passwort sowie Google‑OAuth-Daten und technische Metadaten.<br />
              <strong>Zweck:</strong> Authentifizierung und Kontoverwaltung.<br />
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              3.2 Hosting und Server-Logs via Vercel
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Datenarten:</strong> Server-Logfiles (IP-Adresse, Zugriffszeit, Browsertyp o. Ä.).<br />
              <strong>Zweck:</strong> Betriebssicherheit, Performance und Analyse zur Optimierung.<br />
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              3.3 Cookies und Tracking
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Session-Cookies:</strong> Technisch erforderlich, um Nutzer-Sessions aufrechtzuerhalten.<br />
              <strong>Analyse-Cookies oder Tracking</strong> sind nicht in Verwendung.
            </Typography>
            <Typography variant="h6" gutterBottom>
              4. Datenweitergabe an Dritte
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Clerk, Inc.:</strong> Sub‑Auftragsverarbeiter für Authentifizierungsdienste.<br />
              <strong>Vercel, Inc.:</strong> Hosting-Provider.<br />
              <strong>Google LLC:</strong> Im Rahmen der OAuth‑Anbindung.<br />
              Übermittlungen in Drittländer nur mit geeigneten Garantien (z. B. Standardvertragsklauseln).
            </Typography>
            <Typography variant="h6" gutterBottom>
              5. Aufbewahrungsdauer
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Registrierungsdaten:</strong> Bis zur Kontolöschung oder Widerruf, höchstens 3 Jahre nach letzter Anmeldung.<br />
              <strong>Server-Logs:</strong> Automatisch nach 30 Tagen gelöscht (länger bei Sicherheitsvorfällen).
            </Typography>
            <Typography variant="h6" gutterBottom>
              6. Betroffenenrechte
            </Typography>
            <Typography variant="body1" paragraph>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit, Widerspruch und Widerruf erteilter Einwilligungen sowie das Beschwerderecht bei einer Aufsichtsbehörde.
            </Typography>
            <Typography variant="h6" gutterBottom>
              7. Sicherheit
            </Typography>
            <Typography variant="body1" paragraph>
              Es werden technische und organisatorische Maßnahmen wie TLS‑Verschlüsselung, Firewalls und Zugangskontrollen eingesetzt. Clerk und Vercel verfügen über eigene, regelmäßig geprüfte Sicherheitskonzepte.
            </Typography>
            <Typography variant="h6" gutterBottom>
              8. Aktualität und Änderungen
            </Typography>
            <Typography variant="body1" paragraph>
              Diese Datenschutzerklärung gilt ab dem 6. Mai 2025 und kann bei Bedarf aktualisiert werden. Änderungen werden auf dieser Seite veröffentlicht.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
