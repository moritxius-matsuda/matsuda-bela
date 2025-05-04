"use client";
import { useEffect, useState, useRef } from "react";
import {
  Box, Typography, Card, CardContent, Button, TextField, MenuItem, Stack, Paper, CircularProgress
} from "@mui/material";

const API_URL = "https://console.moritxius.nl/api/v2";
const API_KEY = process.env.NEXT_PUBLIC_MCSS_API_KEY!;

type Server = {
  guid: string;
  name: string;
  status: number;
  description: string;
};

export default function ConsolePage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [command, setCommand] = useState("");
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Serverliste laden
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/servers?filter=2`, {
      headers: { apiKey: API_KEY }
    })
      .then(res => res.json())
      .then(data => {
        setServers(data);
        if (data.length > 0) setSelected(data[0].guid);
      })
      .finally(() => setLoading(false));
  }, []);

  // Konsole laden & poll
  useEffect(() => {
    if (!selected) return;
    const fetchConsole = () => {
      fetch(`${API_URL}/servers/${selected}/console?AmountOfLines=30&Reversed=true`, {
        headers: { apiKey: API_KEY }
      })
        .then(res => res.json())
        .then(data => setConsoleLines(data || []));
    };
    fetchConsole();
    intervalRef.current = setInterval(fetchConsole, 2000);
    return () => clearInterval(intervalRef.current!);
  }, [selected]);

  // Server-Aktion (Start/Stop/Restart)
  const handleAction = async (action: 1 | 2 | 3 | 4) => {
    setActionLoading(true);
    await fetch(`${API_URL}/servers/${selected}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apiKey: API_KEY },
      body: JSON.stringify({ action }),
    });
    setActionLoading(false);
  };

  // Kommando senden
  const sendCommand = async () => {
    if (!command.trim()) return;
    setSending(true);
    await fetch(`${API_URL}/servers/${selected}/command`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apiKey: API_KEY },
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
              select
              label="Server auswählen"
              value={selected}
              onChange={e => setSelected(e.target.value)}
              sx={{ minWidth: 220 }}
              disabled={loading}
            >
              {servers.map(s => (
                <MenuItem value={s.guid} key={s.guid}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
            {selected && (
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
                  color="warning"
                  disabled={actionLoading}
                  onClick={() => handleAction(4)}
                >
                  Restart
                </Button>
              </Stack>
            )}
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
          consoleLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))
        )}
      </Paper>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Kommando eingeben"
          value={command}
          onChange={e => setCommand(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") sendCommand();
          }}
          fullWidth
          disabled={!selected || sending}
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
