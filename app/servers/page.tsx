"use client";
import { useEffect, useState, useRef } from "react";
import {
  Container, Typography, Card, CardContent, Button,
  Box, Divider, Paper, Chip, Stack, CircularProgress
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import StopIcon from "@mui/icons-material/Stop";
import TerminalIcon from "@mui/icons-material/Terminal";

const API_URL = "https://console.moritxius.nl/api/v2";
const API_KEY = process.env.NEXT_PUBLIC_MCSS_API_KEY!;
const SERVER_ID = "86c006fd-bdbb-4227-86c8-f9a8ceb73216";

const statusMap: Record<number, { label: string; color: "success" | "error" | "warning" | "default" }> = {
  0: { label: "Offline", color: "error" },
  1: { label: "Online", color: "success" },
  2: { label: "Startet", color: "warning" },
  3: { label: "Stoppt", color: "warning" },
  4: { label: "Neustartet", color: "warning" },
};

export default function ServersPage() {
  const [server, setServer] = useState<any>(null);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Polling für Status und Konsole
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchData = async () => {
      setLoading(true);
      // Serverstatus
      const statusRes = await fetch(`${API_URL}/servers/${SERVER_ID}`, {
        method: "GET",
        headers: {
          "apiKey": API_KEY,
          "Content-Type": "application/json",
        },
      });
      const serverData = await statusRes.json();
      setServer(serverData);

      // Konsole
      const consoleRes = await fetch(
        `${API_URL}/servers/${SERVER_ID}/console?amountOfLines=-1`,
        {
          method: "GET",
          headers: {
            "apiKey": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      const consoleData = await consoleRes.json();
      setConsoleLines(consoleData.lines || []);
      setLoading(false);
    };

    fetchData();
    interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  // Aktionen: Start/Stop/Restart
  const handleAction = async (action: "start" | "stop" | "restart") => {
    setActionLoading(true);
    let actionCode = 0;
    if (action === "stop") actionCode = 1;
    if (action === "start") actionCode = 2;
    if (action === "restart") actionCode = 4;
    await fetch(`${API_URL}/servers/${SERVER_ID}/execute/action`, {
      method: "POST",
      headers: {
        "apiKey": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: actionCode }),
    });
    setActionLoading(false);
  };

  const status = server?.status ?? 0;

  const consoleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLines]);

  if (loading && !server) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Servers
      </Typography>
      <Card variant="outlined" sx={{ mb: 5, bgcolor: "background.paper" }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <TerminalIcon fontSize="large" color="primary" />
            <Box>
              <Typography variant="h5">
                {server?.name || "JCWSMP"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {server?.description || "Minecraft Server von MC Server Soft"}
              </Typography>
            </Box>
            <Box flex={1} />
            <Chip
              label={statusMap[status]?.label || "Unbekannt"}
              color={statusMap[status]?.color || "default"}
              sx={{ fontWeight: "bold", fontSize: 16 }}
            />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Typ:</strong> {server?.type || "Paper"} | <strong>RAM:</strong> {server?.javaAllocatedMemory || 0} MB
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Pfad:</strong> {server?.pathToFolder}
          </Typography>
          {/* Server Actions */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<PowerSettingsNewIcon />}
              disabled={status === 1 || actionLoading}
              onClick={() => handleAction("start")}
            >
              Start
            </Button>
            <Button
              variant="contained"
              color="warning"
              startIcon={<RestartAltIcon />}
              disabled={status !== 1 || actionLoading}
              onClick={() => handleAction("restart")}
            >
              Neustart
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<StopIcon />}
              disabled={status !== 1 || actionLoading}
              onClick={() => handleAction("stop")}
            >
              Stop
            </Button>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Console Output (readonly)
          </Typography>
          <Paper
            ref={consoleRef}
            variant="outlined"
            sx={{
              bgcolor: "#111",
              color: "#0f0",
              fontFamily: "monospace",
              minHeight: 200,
              maxHeight: 400,
              overflowY: "auto",
              p: 2,
              borderRadius: 2,
            }}
          >
            {consoleLines.length === 0
              ? <Typography color="text.secondary">Keine Ausgaben.</Typography>
              : consoleLines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
          </Paper>
        </CardContent>
      </Card>
    </Container>
  );
}
