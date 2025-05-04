// app/page.tsx
import { Container, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Willkommen auf der Hauptseite
      </Typography>
      <Typography>
        Hier kannst du deine Hauptinhalte platzieren.
      </Typography>
    </Container>
  );
}
