"use client";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk für User & Rolle
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";

const API_URL = "https://console.moritxius.nl/api/v2";
const API_KEY = process.env.NEXT_PUBLIC_MCSS_API_KEY!;
const SERVER_ID = "86c006fd-bdbb-4227-86c8-f9a8ceb73216";
const SERVER_NAME = "JCWSMP";
const ALLOWED_ROLES = ["admin", "console", "jcwsmp"];

console.log(process.env.NEXT_PUBLIC_MCSS_API_KEY + "ea22")

export default function ConsolePage() {
  // Clerk User-Objekt holen
  const { isLoaded, isSignedIn, user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  // Zugriff prüfen
  if (!isLoaded) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!isSignedIn) {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        Du musst angemeldet sein, um auf die Konsole zuzugreifen.
      </Alert>
    );
  }
  if (!role || !ALLOWED_ROLES.includes(role)) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Kein Zugriff – diese Seite ist nur für Admins, Console und JCWSMP!
      </Alert>
    );
  }

  // --- ab hier wie gehabt ---
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Automatisch nach unten scrollen, wenn neue Ausgaben kommen
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleLines]);

  // Konsole laden & poll
  useEffect(() => {
    const fetchConsole = () => {
      fetch(
        `${API_URL}/servers/${SERVER_ID}/console?AmountOfLines=30&Reversed=true`,
        {
          headers: { apikey: API_KEY },
        }
      )
        .then((res) => res.json())
        .then((data) => setConsoleLines(Array.isArray(data) ? data : []));
    };
    fetchConsole();
    intervalRef.current = setInterval(fetchConsole, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Server-Aktion (Start/Stop/Kill/Restart)
  const handleAction = async (action: 1 | 2 | 3 | 4) => {
    setActionLoading(true);
    await fetch(`${API_URL}/servers/${SERVER_ID}/execute/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
      },
      body: JSON.stringify({ action }),
    });
    setActionLoading(false);
  };

  // Kommando senden
  const sendCommand = async () => {
    if (!command.trim()) return;
    setSending(true);
    await fetch(`${API_URL}/servers/${SERVER_ID}/execute/command`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
      },
      body: JSON.stringify({ command }),
    });
    setCommand("");
    setSending(false);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Jarrett's Crazy World SMP
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <TextField
              label="Server"
              value={SERVER_NAME}
              InputProps={{ readOnly: true }}
              sx={{ minWidth: 220 }}
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="success"
                disabled={actionLoading}
                onClick={() => handleAction(2)}
              >
                Start
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={actionLoading}
                onClick={() => handleAction(1)}
              >
                Stop
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disabled={actionLoading}
                onClick={() => handleAction(3)}
              >
                Kill
              </Button>
              <Button
                variant="contained"
                color="warning"
                disabled={actionLoading}
                onClick={() => handleAction(4)}
              >
                Restart
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Paper
        sx={{
          minHeight: 350,
          maxHeight: 400,
          overflow: "auto",
          bgcolor: "#181818",
          color: "#fff",
          fontFamily: "monospace",
          p: 2,
          mb: 2,
        }}
      >
        {consoleLines.length === 0 ? (
          <Typography color="grey.500">Keine Ausgaben...</Typography>
        ) : (
          <>
            {consoleLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            <div ref={consoleEndRef} />
          </>
        )}
      </Paper>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Kommando eingeben"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendCommand();
          }}
          fullWidth
          disabled={sending}
          autoComplete="off"
        />
        <Button
          variant="contained"
          onClick={sendCommand}
          disabled={!command.trim() || sending}
        >
          Absenden
        </Button>
      </Stack>
    </Box>
  );
}
