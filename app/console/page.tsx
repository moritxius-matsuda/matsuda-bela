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

export default function ConsolePage() {
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    await fetch(`${API_URL}/servers/${SERVER_ID}/command`, {
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
        MCSS Server-Konsole
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
  );
}
