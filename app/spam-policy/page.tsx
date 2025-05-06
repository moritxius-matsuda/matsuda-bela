// app/spam-policy/page.tsx
"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function SpamPolicyPage() {
  return (
    <Box sx={{ maxWidth: 700, mx: "auto", py: 6, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        SPAM-Richtlinie / SPAM Policy
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Typography variant="h6" gutterBottom>
        Deutsch:
      </Typography>
      <Typography paragraph>
        Der Versand unerwünschter kommerzieller Nachrichten an die auf diesem Internetauftritt angegebenen Kontaktdaten ist ohne vorherige ausdrückliche Einwilligung <strong>untersagt</strong>. Dies gilt insbesondere für Werbung per E-Mail, Post, Telefon oder andere elektronische Kommunikationswege.
      </Typography>
      <Typography paragraph>
        Jegliche unverlangte Werbung stellt einen Verstoß gegen <strong>§ 7 Abs. 2 Nr. 2 des Gesetzes gegen den unlauteren Wettbewerb (UWG)</strong> dar und kann rechtliche Konsequenzen nach sich ziehen. Zudem kann der unrechtmäßige Umgang mit personenbezogenen Daten einen Verstoß gegen die Datenschutz-Grundverordnung (DSGVO) darstellen.
      </Typography>
      <Typography paragraph>
        Wir behalten uns ausdrücklich vor, gegen unerlaubte Werbesendungen rechtliche Schritte einzuleiten. Dies umfasst insbesondere Unterlassungs- und Schadensersatzansprüche sowie die Meldung an die zuständigen Behörden.
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        English:
      </Typography>
      <Typography paragraph>
        The sending of unsolicited commercial messages to the contact details provided on this website is <strong>prohibited</strong> without prior express consent. This applies in particular to advertising by e-mail, post, telephone or other electronic communication channels.
      </Typography>
      <Typography paragraph>
        Any unsolicited advertising constitutes a violation of <strong>Section 7 (2) No. 2 of the German Act against Unfair Competition (UWG)</strong> and may have legal consequences. In addition, the unlawful handling of personal data may constitute a breach of the General Data Protection Regulation (GDPR).
      </Typography>
      <Typography paragraph>
        Wir behalten uns ausdrücklich vor, gegen unerlaubte Werbesendungen rechtliche Schritte einzuleiten. Dies umfasst insbesondere Unterlassungs- und Schadensersatzansprüche sowie die Meldung an die zuständigen Behörden.
      </Typography>
    </Box>
  );
}
