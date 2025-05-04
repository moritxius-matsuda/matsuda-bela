"use client";
import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Paper,
} from "@mui/material";

const API_URL = "https://console.moritxius.nl/api/v2";
const API_KEY = process.env.NEXT_PUBLIC_MCSS_API_KEY!;
const SERVER_ID = "86c006fd-bdbb-4227-86c8-f9a8ceb73216";
const SERVER_NAME = "JCWSMP";

console.log(process.env.NEXT_PUBLIC_MCSS_API_KEY + "da22")

export default function ConsolePage() {
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const consoleContainerRef = useRef<HTMLDivElement>(null);

  // Nur der Konsolenbereich scrollt automatisch nach unten
  useEffect(() => {
    const el = consoleContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [consoleLines]);

  // Funktion um die Konsole zu laden
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

  // Polling starten
  const startPolling = () => {
    fetchConsole();
    setIsConnected(true);
    intervalRef.current = setInterval(fetchConsole, 2000);

    // Nach 3 Minuten Polling stoppen
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsConnected(false);
    }, 3 * 60 * 1000); // 3 Minuten
  };

  // Beim Mount starten
  useEffect(() => {
    startPolling();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
    <Box sx={{ maxWidth: 900, mx: "auto", py: 6, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flexGrow: 1 }}>
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
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
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
                {!isConnected && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={startPolling}
                    sx={{ marginLeft: "auto" }}
                  >
                    Verbindung herstellen
                  </Button>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Paper
          ref={consoleContainerRef}
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
            consoleLines.map((line, i) => <div key={i}>{line}</div>)
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
    </Box>
  );
}
