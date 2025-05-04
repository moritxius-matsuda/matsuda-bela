"use client";

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

type Post = { id: number; title: string; content: string; createdAt: string };

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/posts")
        .then((res) => res.json())
        .then((data) => {
          setPosts(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  if (!isLoaded) return null;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Projektbeschreibung */}
      <SpeedInsights/>
      <Analytics/>
      <Typography variant="h3" color="primary" gutterBottom>
        Matsuda-Projekt
      </Typography>
      <Typography variant="h5" gutterBottom>
        Die Plattform für Funkamateure – fair, transparent, innovativ.
      </Typography>
      <Typography variant="body1" sx={{ fontStyle: "italic", mt: 3, marginBottom: 4}}>
        Der voraussichtliche Start ist im Herbst 2027.
      </Typography>
      <Stack spacing={4} sx={{ mb: 6 }}>
        <Card variant="outlined" sx={{ bgcolor: "background.paper" }}>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom>
              Matsuda Marketplace
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Matsuda Marketplace</strong> ist eine globale Online-Plattform für den fairen, transparenten und sicheren Handel mit Amateurfunk-Equipment. Unser Ziel ist es, Funkamateuren weltweit einen zentralen, vertrauenswürdigen Marktplatz zu bieten – unabhängig von Erfahrung oder Spezialisierung.
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "1.2em", color: "#b0bec5" }}>
              <li>Feste, transparente Preise – keine Auktionen</li>
              <li>Weltweiter Gratisversand</li>
              <li>Starker Käuferschutz: Zahlung erst nach erfolgreicher Lieferung</li>
              <li>Einfache Registrierung mit bestehenden Konten (Google, eBay, AliExpress, Facebook)</li>
              <li>Große Auswahl an Amateurfunk-Equipment und Zubehör</li>
              <li>Kompetenter, freundlicher Support mit Feedbacksystem</li>
              <li>Flexible Zahlungsmethoden (PayPal, SEPA, Klarna, Amazon Pay, u.a.)</li>
            </ul>
            <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
              Die Plattform basiert auf moderner, sicherer Technik und startet mit Fokus auf Nischenprodukte, die sonst schwer zu finden sind.
            </Typography>
          </CardContent>
        </Card>

        <Divider sx={{ bgcolor: "primary.dark" }} />

        <Card variant="outlined" sx={{ bgcolor: "background.paper" }}>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom>
              Matsuda Radio
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Matsuda Radio</strong> ist die Vision, eigene Funkgeräte und Zubehör zu entwickeln – mit und für die Amateurfunk-Community. Im Mittelpunkt stehen Qualität, innovative Features und ein attraktives Preis-Leistungs-Verhältnis.
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "1.2em", color: "#b0bec5" }}>
              <li>Community-basiert: Entwicklung nach den Wünschen der Nutzer</li>
              <li>Innovative Produkte – zunächst Zubehör, später auch Transceiver</li>
              <li>Hoher Qualitätsanspruch und moderne Technik</li>
            </ul>
            <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
              Matsuda Radio steht für die langfristige Entwicklung praxisnaher, hochwertiger Lösungen – entwickelt von Funkamateuren für Funkamateure.
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Beiträge */}
      <Typography variant="h5" gutterBottom>
        Beiträge
      </Typography>

      {!isSignedIn ? (
        <Card sx={{ p: 3, textAlign: "center", bgcolor: "background.paper" }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Bitte melde dich an, um Beiträge zu sehen.
          </Typography>
          <Button variant="contained" href="/sign-in">
            Jetzt anmelden
          </Button>
        </Card>
      ) : loading ? (
        <Typography>Lade Beiträge...</Typography>
      ) : posts.length === 0 ? (
        <Typography>Keine Beiträge vorhanden.</Typography>
      ) : (
        <Stack spacing={3}>
          {posts.map((post) => (
            <Card key={post.id} variant="outlined" sx={{ bgcolor: "background.paper" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {new Date(post.createdAt).toLocaleDateString("de-DE")}
                </Typography>
                {/* Hier wird der Inhalt als HTML angezeigt */}
                <div
                  style={{ marginTop: 8 }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
