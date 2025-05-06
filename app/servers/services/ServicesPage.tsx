"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

// Mapping für Anzeige
const SERVICE_LABELS: Record<string, string> = {
  serial: "Serielle Verbindung",
  flask: "Flask Server",
};

export default function ServicesPage() {
  const [status, setStatus] = useState<{ [key: string]: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  // Status abrufen
  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("https://api.moritxius.de/api/status");
      if (!res.ok) throw new Error("Fehler beim Abrufen des Service-Status");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setError("Fehler beim Abrufen des Service-Status");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  // Service starten/stoppen
  const controlService = async (service: string, action: "start" | "stop") => {
    const key = `${service}_${action}`;
    try {
      setActionLoading((prev) => ({ ...prev, [key]: true }));
      const res = await fetch(`https://api.moritxius.de/api/${action}/${service}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Fehler bei der Aktion");
      await fetchStatus();
    } catch (err) {
      setError(`Fehler beim ${action === "start" ? "Starten" : "Stoppen"} von ${service}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // alle 10s aktualisieren
    return () => clearInterval(interval);
  }, []);

  if (loading && !status) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", py: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Services verwalten
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="outlined"
        onClick={fetchStatus}
        sx={{ mb: 3 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
        Status aktualisieren
      </Button>

      <Stack spacing={3}>
        {status &&
          Object.entries(status).map(([serviceId, isRunning]) => (
            <Card variant="outlined" key={serviceId}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">{SERVICE_LABELS[serviceId] || serviceId}</Typography>
                  <Chip
                    icon={isRunning ? <CheckCircleIcon /> : <CancelIcon />}
                    label={isRunning ? "Aktiv" : "Inaktiv"}
                    color={isRunning ? "success" : "error"}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isRunning || actionLoading[`${serviceId}_start`]}
                    onClick={() => controlService(serviceId, "start")}
                  >
                    {actionLoading[`${serviceId}_start`] ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                    Starten
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    disabled={!isRunning || actionLoading[`${serviceId}_stop`]}
                    onClick={() => controlService(serviceId, "stop")}
                  >
                    {actionLoading[`${serviceId}_stop`] ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                    Stoppen
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
      </Stack>
    </Box>
  );
}
