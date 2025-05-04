// app/servers/page.tsx
import { revalidatePath } from "next/cache";
import {
  Container, Typography, Card, CardContent, CardActions, Button,
  Box, Divider, Paper, Chip, Stack
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import StopIcon from "@mui/icons-material/Stop";
import TerminalIcon from "@mui/icons-material/Terminal";

const API_URL = "https://console.moritxius.nl/api/v2";
const API_KEY = process.env.MCSS_API_KEY!;
const SERVER_ID = "86c006fd-bdbb-4227-86c8-f9a8ceb73216";

const statusMap: Record<number, { label: string; color: "success" | "error" | "warning" | "default" }> = {
  0: { label: "Offline", color: "error" },
  1: { label: "Online", color: "success" },
  2: { label: "Startet", color: "warning" },
  3: { label: "Stoppt", color: "warning" },
  4: { label: "Neustartet", color: "warning" },
};

async function getServerStatus() {
  const res = await fetch(`${API_URL}/servers/${SERVER_ID}`, {
    headers: {
      "apiKey": API_KEY,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Fehler beim Laden des Serverstatus");
  return await res.json();
}

async function getServerConsole() {
    const res = await fetch(
      `${API_URL}/servers/${SERVER_ID}/console?amountOfLines=-1`,
      {
        method: "POST",
        headers: {
          "apiKey": API_KEY,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.lines || [];
  }
  

// Server Action für Start/Stop/Restart
async function serverAction(action: "start" | "stop" | "restart") {
  "use server";
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
    cache: "no-store",
  });
  revalidatePath("/servers");
}

export default async function ServersPage() {
  let server: any = null;
  let consoleLines: string[] = [];
  try {
    server = await getServerStatus();
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
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <form action={async () => { "use server"; await serverAction("start"); }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<PowerSettingsNewIcon />}
                disabled={status === 1}
                type="submit"
              >
                Start
              </Button>
            </form>
            <form action={async () => { "use server"; await serverAction("restart"); }}>
              <Button
                variant="contained"
                color="warning"
                startIcon={<RestartAltIcon />}
                disabled={status !== 1}
                type="submit"
              >
                Neustart
              </Button>
            </form>
            <form action={async () => { "use server"; await serverAction("stop"); }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<StopIcon />}
                disabled={status !== 1}
                type="submit"
              >
                Stop
              </Button>
            </form>
          </Stack>
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
