"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Container, Typography, Card, CardContent, CardActions,
  Button, Box, Divider, CircularProgress, Paper, Chip, Stack, Snackbar, Alert
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import StopIcon from "@mui/icons-material/Stop";
import TerminalIcon from "@mui/icons-material/Terminal";

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

export default function ServersPage() {
  // Clerk User-Check
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  // Weiterleitung bei fehlender Berechtigung
  useEffect(() => {
    if (!isLoaded) return;
    const role = user?.publicMetadata?.role;
    if (!isSignedIn) {
      router.replace("/sign-in");
    } else if (role !== "admin" && role !== "jcwsmp") {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Während Clerk lädt: Spinner
  if (!isLoaded) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Während Weiterleitung: nichts anzeigen
  const role = user?.publicMetadata?.role;
  if (!isSignedIn || (role !== "admin" && role !== "jcwsmp")) {
    return null;
  }

  // --- Server Card Logik ---
  const [server, setServer] = useState<any>(null);
  const [status, setStatus] = useState<number>(0);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  // Polling für Status und Konsole
  useEffect(() => {
    let interval: any;
    let consoleInterval: any;

    const fetchServer = async () => {
      setLoading(true);
      const res = await fetch("/api/mcss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: "/servers" }),
      });
      const data = await res.json();
      const found = data.find((s: any) => s.serverId === SERVER_ID);
      setServer(found);
      setStatus(found?.status ?? 0);
      setLoading(false);
    };

    const fetchConsole = async () => {
      const res = await fetch("/api/mcss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: `/servers/${SERVER_ID}/console`,
          method: "POST",
          body: { amountOfLines: 50, reversed: true },
        }),
      });
      const data = await res.json();
      setConsoleLines(data.lines || []);
    };

    fetchServer();
    fetchConsole();
    interval = setInterval(fetchServer, 5000);
    consoleInterval = setInterval(fetchConsole, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(consoleInterval);
    };
  }, []);

  // Aktionen
  async function handleAction(action: "start" | "stop" | "restart") {
    setActionLoading(true);
    let actionCode = 0;
    if (action === "stop") actionCode = 1;
    if (action === "start") actionCode = 2;
    if (action === "restart") actionCode = 4;
    const res = await fetch("/api/mcss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: `/servers/${SERVER_ID}/execute/action`,
        method: "POST",
        body: { action: actionCode },
      }),
    });
    if (res.ok) {
      setSnackbar({
        open: true,
        message: `Aktion "${action}" ausgeführt. Status wird aktualisiert.`,
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: `Fehler bei Aktion "${action}".`,
        severity: "error",
      });
    }
    setActionLoading(false);
  }

  // Scroll-Ref für Konsole
  const consoleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLines]);

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
          <CardActions sx={{ gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<PowerSettingsNewIcon />}
              disabled={status === 3 || actionLoading}
              onClick={() => handleAction("start")}
            >
              Start
            </Button>
            <Button
              variant="contained"
              color="warning"
              startIcon={<RestartAltIcon />}
              disabled={status !== 3 || actionLoading}
              onClick={() => handleAction("restart")}
            >
              Neustart
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<StopIcon />}
              disabled={status !== 3 || actionLoading}
              onClick={() => handleAction("stop")}
            >
              Stop
            </Button>
          </CardActions>
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
