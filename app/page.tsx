"use client";
import { useUser } from "@clerk/nextjs";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";

const JCWSMP_ALLOWED_ROLES = ["jcwsmp"];

export default function HomePage() {
  const { isSignedIn, user } = useUser();
  // Hole das Rollen-Array aus publicMetadata
  const userRoles = user?.publicMetadata?.roles as string[] | undefined;
  // Prüfe, ob mindestens eine erlaubte Rolle dabei ist
  const hasJCWSMPAccess = userRoles?.some(role => JCWSMP_ALLOWED_ROLES.includes(role));

  return (
    <Box sx={{ py: 6, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Willkommen auf der Hauptseite
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mt: 3,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {/* Beispiel-Kachel */}
        <Card sx={{ flex: "1 1 250px", minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6">Andere Kachel</Typography>
            <Typography variant="body2">Beliebiger Text</Typography>
          </CardContent>
        </Card>

        {/* JCWSMP Kachel, für mehrere Rollen */}
        {isSignedIn && hasJCWSMPAccess && (
          <Card sx={{ flex: "1 1 250px", minWidth: 250 }}>
            <CardContent>
              <Typography variant="h6">JCWSMP – Konsole</Typography>
              <Typography variant="body2" color="text.secondary">
                Minecraft-Server Konsole & Steuerung
              </Typography>
              <Button
                component={Link}
                href="/console?name=JCWSMP&server=86c006fd-bdbb-4227-86c8-f9a8ceb73216"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Öffnen
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
