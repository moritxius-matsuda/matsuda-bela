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
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useUser } from "@clerk/nextjs";


const SERVICE_LABELS: Record<string, string> = {
  serielle_verbindung: "Serielle Verbindung",
  flask_server: "Flask Server",
};

type Service = {
  name: string;
  pid: number | null;
  running: boolean | null;
};

type RelayState = { num: number; isOn: boolean };
const RELAY_API_PASSWORD = "r>(gy3J)g~8S#=v§";

export default function ServicesPage() {
  // Zugriffsrechte
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.admin === 1;
  // Services
  const [status, setStatus] = useState<Service[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  // Relays
  const [relayStatus, setRelayStatus] = useState<RelayState[] | null>(null);
  const [relayLoading, setRelayLoading] = useState(false);
  const [relayError, setRelayError] = useState<string | null>(null);
  const [relayActionLoading, setRelayActionLoading] = useState<{ [key: number]: boolean }>({});

  // Service-Status abrufen
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
      setError(`Fehler beim ${action === "start" ? "Starten" : "Stoppen"} von ${service.replace("_", " ")}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Relay-Status abrufen
  const fetchRelayStatus = async () => {
    try {
      setRelayLoading(true);
      setRelayError(null);
      const res = await fetch("https://door.moritxius.de/api/status", {
        headers: {
          "x-api-password": RELAY_API_PASSWORD,
        },
      });
      if (!res.ok) throw new Error("Fehler beim Abrufen des Relay-Status");
      const data = await res.json();
      // Wandelt das Objekt in ein Array von {num, isOn}
      const relaysArr: RelayState[] = Object.entries(data.relays).map(([num, state]) => ({
        num: Number(num),
        isOn: state === "ON",
      }));
      setRelayStatus(relaysArr);
    } catch (err) {
      setRelayError("Fehler beim Abrufen des Relay-Status");
      setRelayStatus(null);
    } finally {
      setRelayLoading(false);
    }
  };

  // Relay schalten
  const setRelay = async (relay: number, state: "open" | "close") => {
    setRelayActionLoading((prev) => ({ ...prev, [relay]: true }));
    try {
      const res = await fetch(`https://door.moritxius.de/api/${relay}/${state}`, {
        method: "POST",
        headers: {
          "x-api-password": RELAY_API_PASSWORD,
        },
      });
      if (!res.ok) throw new Error("Fehler beim Schalten von Relais " + relay);
      await fetchRelayStatus();
    } catch (err) {
      setRelayError(`Fehler beim Schalten von Relais ${relay}`);
    } finally {
      setRelayActionLoading((prev) => ({ ...prev, [relay]: false }));
    }
  };

  // Initial laden
  useEffect(() => {
    fetchStatus();
    fetchRelayStatus();
    const interval1 = setInterval(fetchStatus, 10000);
    const interval2 = setInterval(fetchRelayStatus, 10000);
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  // Services-UI
  const renderServices = () => (
    <Stack spacing={3} sx={{ mb: 6 }}>
      {status &&
        status.map((service) => {
          let statusLabel = "Unbekannt";
          let statusColor: "success" | "error" | "default" = "default";
          let statusIcon: React.ReactNode = <HelpOutlineIcon />;
          if (service.running === true) {
            statusLabel = "Aktiv";
            statusColor = "success";
            statusIcon = <CheckCircleIcon />;
          } else if (service.running === false) {
            statusLabel = "Inaktiv";
            statusColor = "error";
            statusIcon = <CancelIcon />;
          }

          return (
<Card variant="outlined" key={service.name}>
  <CardContent>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Typography variant="h6">{SERVICE_LABELS[service.name] || service.name}</Typography>
      <Chip
        icon={statusIcon}
        label={statusLabel}
        color={statusColor}
      />
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      PID: {service.pid !== null ? service.pid : "-"}
    </Typography>
    <Box sx={{ display: "flex", gap: 2 }}>
      {isAdmin ? (
        <>
          <Button
            variant="contained"
            color="primary"
            disabled={service.running === true || actionLoading[`${service.name}_start`]}
            onClick={() => controlService(service.name, "start")}
          >
            {actionLoading[`${service.name}_start`] ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            Starten
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={service.running !== true || actionLoading[`${service.name}_stop`]}
            onClick={() => controlService(service.name, "stop")}
          >
            {actionLoading[`${service.name}_stop`] ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            Stoppen
          </Button>
        </>
      ) : (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Nur Admins können die Dienste steuern. Admin-Status: {isAdmin}
        </Typography>
      )}
    </Box>
  </CardContent>
</Card>

          );
        })}
    </Stack>
  );

  // Relais-UI
  const renderRelays = () => (
    <Card variant="outlined" sx={{ mb: 6 }}>
  <CardContent>
    <Typography variant="h5" gutterBottom>
      Relay Gateway
    </Typography>
    {relayError && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {relayError}
      </Alert>
    )}
    <Button
      variant="outlined"
      onClick={fetchRelayStatus}
      sx={{ mb: 3 }}
      disabled={relayLoading}
    >
      {relayLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
      Status aktualisieren
    </Button>
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "flex-start",
      }}
    >
      {relayStatus &&
        relayStatus.map(({ num, isOn }) => (
          <Box
            key={num}
            sx={{
              width: { xs: "100%", sm: "48%", md: "23%" },
              minWidth: 140,
              mb: 2,
              p: 1,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
              textAlign: "center",
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Relais {num}
            </Typography>
            <Chip
              icon={isOn ? <CheckCircleIcon /> : <CancelIcon />}
              label={isOn ? "An" : "Aus"}
              color={isOn ? "success" : "error"}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 1 }}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                disabled={isOn || relayActionLoading[num]}
                onClick={() => setRelay(num, "open")}
              >
                {relayActionLoading[num] && !isOn ? (
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                ) : null}
                An
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                disabled={!isOn || relayActionLoading[num]}
                onClick={() => setRelay(num, "close")}
              >
                {relayActionLoading[num] && isOn ? (
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                ) : null}
                Aus
              </Button>
            </Box>
          </Box>
        ))}
    </Box>
  </CardContent>
</Card>
  );

  if (loading && !status) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 4, px: 2 }}>
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

      {renderServices()}
      {renderRelays()}
    </Box>
  );
}
