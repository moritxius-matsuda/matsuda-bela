// app/page.tsx
"use client";
import { useUser } from "@clerk/nextjs";
import Grid from "@mui/material/Grid";
import { Container, Typography, Card, CardContent, Button } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  const { user, isLoaded, isSignedIn } = useUser();

  // Rolle aus Clerk-Metadaten holen (ggf. anpassen!)
  const role = user?.publicMetadata?.role;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Willkommen auf der Hauptseite
      </Typography>
      <Grid container spacing={3}>
        {/* Andere Kacheln ... */}

        {/* JCWSMP Konsole Kachel, nur für Rollen jcwsmp oder admin */}
        {isSignedIn && (role === "jcwsmp" || role === "admin") && (
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  JCWSMP - Konsole
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Minecraft-Server Konsole & Steuerung
                </Typography>
                <Button
                  component={Link}
                  href="https://console.moritxius.nl/"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Öffnen
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
