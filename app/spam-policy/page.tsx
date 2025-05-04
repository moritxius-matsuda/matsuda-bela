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
        Der Versand unerwünschter, kommerzieller Nachrichten (per E-Mail oder Post) an Adressen im Verantwortungsbereich dieses Internetauftritts ist untersagt und kann mit einer Bearbeitungsgebühr von <strong>35 Euro pro Nachricht</strong> belegt werden.
      </Typography>
      <Typography paragraph>
        Bei Verwendung gefälschter oder irreführender Absenderinformationen behalten wir uns vor, zusätzliche Gebühren in Höhe des technischen und rechtlichen Aufwands zur Nachverfolgung und Durchsetzung geltend zu machen.
      </Typography>
      <Typography paragraph>
        Mit dem Versenden solcher Nachrichten erklären Sie sich automatisch mit dieser Regelung einverstanden.
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        English:
      </Typography>
      <Typography paragraph>
        Sending unsolicited commercial messages (via email or postal mail) to addresses under the responsibility of this service is prohibited and may result in a processing fee of <strong>35€ per message</strong>.
      </Typography>
      <Typography paragraph>
        If forged or misleading sender information is used, we reserve the right to charge additional fees based on the technical and legal effort required to trace and enforce our policy.
      </Typography>
      <Typography paragraph>
        By sending such messages, you automatically agree to these terms.
      </Typography>
    </Box>
  );
}
