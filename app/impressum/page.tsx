// app/impressum/page.tsx

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function ImpressumPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Impressum
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" paragraph>
          <strong>Anbieterkennzeichnung nach § 5 DDG und Verantwortlicher nach § 18 MStV:</strong><br />
          Matsuda Béla<br />
          Am Weidengraben 65<br />
          54296 Trier<br />
          Deutschland
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Betrieben durch (Haftungsausschluss gemäß § 18 Absatz 2 Satz 3, 4 MStV):</strong><br />
          Moritz Béla Meier
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Medienrechtlich verantwortlich gemäß § 18 MStV:</strong><br />
          Andreas Meier
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
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a> finden.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Urheberrechtlicher Hinweis:</strong><br />
          Die Inhalte dieser Website sind urheberrechtlich geschützt. Jegliche Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung von Matsuda Béla.
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
    </Container>
  );
}
