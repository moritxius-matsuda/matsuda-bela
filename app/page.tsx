import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";

type HomePageProps = {
  isSignedIn: boolean;
  role?: string;
};

export default function HomePage({ isSignedIn, role }: HomePageProps) {
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

        {/* JCWSMP Kachel, nur für bestimmte Rollen */}
        {isSignedIn && (role === "jcwsmp" || role === "admin") && (
          <Card sx={{ flex: "1 1 250px", minWidth: 250 }}>
            <CardContent>
              <Typography variant="h6">JCWSMP – Konsole</Typography>
              <Typography variant="body2" color="text.secondary">
                Minecraft-Server Konsole & Steuerung
              </Typography>
              <Button
                component={Link}
                href="/servers"
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
