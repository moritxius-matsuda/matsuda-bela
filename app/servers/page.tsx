import { revalidatePath } from "next/cache";
import { Container, Typography, Card, CardContent, CardActions, Button, Box, Divider, CircularProgress, Paper, Chip, Stack, Snackbar, Alert } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import StopIcon from "@mui/icons-material/Stop";
import TerminalIcon from "@mui/icons-material/Terminal";
import { useState } from "react";

const API_URL = "https://console.moritxius.nl/api/v2";
const API_KEY = process.env.MCSS_API_KEY!;
const SERVER_ID = "86c006fd-bdbb-4227-86c8-f9a8ceb73216";

const statusMap: Record<number, { label: string; color: "success" | "error" | "warning" | "default" }> = {
  0: { label: "Unbekannt", color: "default" },
  1: { label: "Gestoppt", color: "error" },
  2: { label: "Startet", color: "warning" },
  3: { label: "Online", color: "success" },
  4: { label: "Stoppt", color: "warning" },
  5: { label: "Neustartet", color: "warning" },
  6: { label: "Wird beendet", color: "warning" },
};

async function getServerInfo() {
  const res = await fetch(`${API_URL}/servers`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Serverdaten");
  const servers = await res.json();
  return servers.find((s: any) => s.serverId === SERVER_ID);
}

async function getServerConsole() {
  const res = await fetch(`${API_URL}/servers/${SERVER_ID}/console`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amountOfLines: 50, reversed: true }),
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.lines || [];
}

// Server Actions für Start/Stop/Restart
async function serverAction(action: "start" | "stop" | "restart") {
  "use server";
  let actionCode = 0;
  if (action === "stop") actionCode = 1;
  if (action === "start") actionCode = 2;
  if (action === "restart") actionCode = 4;
  const res = await fetch(`${API_URL}/servers/${SERVER_ID}/execute/action`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: actionCode }),
    cache: "no-store",
  });
  revalidatePath("/servers");
  return res.ok;
}

export default async function ServersPage() {
  let server = null;
  let consoleLines: string[] = [];
  try {
    server = await getServerInfo();
    consoleLines = await getServerConsole();
  } catch (e) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography color="error">Fehler beim Laden der Serverdaten.</Typography>
      </Container>
    );
  }

  const status = server?.status ?? 0;

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
          {/* Server Actions als Formulare */}
          <form action={async () => { await serverAction("start"); }}>
            <CardActions sx={{ gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<PowerSettingsNewIcon />}
                disabled={status === 3}
                type="submit"
              >
                Start
              </Button>
            </CardActions>
          </form>
          <form action={async () => { await serverAction("restart"); }}>
            <CardActions sx={{ gap: 2 }}>
              <Button
                variant="contained"
                color="warning"
                startIcon={<RestartAltIcon />}
                disabled={status !== 3}
                type="submit"
              >
                Neustart
              </Button>
            </CardActions>
          </form>
          <form action={async () => { await serverAction("stop"); }}>
            <CardActions sx={{ gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<StopIcon />}
                disabled={status !== 3}
                type="submit"
              >
                Stop
              </Button>
            </CardActions>
          </form>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Console Output (readonly)
          </Typography>
          <Paper
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
