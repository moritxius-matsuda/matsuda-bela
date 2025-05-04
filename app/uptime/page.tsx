"use client";
import { useEffect, useState } from "react";
import {
  Container, Typography, Card, CardContent, Box, Divider, Chip, Stack, Paper, CircularProgress
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const SITES = [
  { name: "moritxius.nl", id: "moritxius.nl" },
  { name: "moritxius.de", id: "moritxius.de" },
  { name: "home.dm1lx.de", id: "home.dm1lx.de" },
];

type PingResult = {
  timestamp: number;
  status: "up" | "down";
  responseTime: number | null;
};

function getUptime(history: PingResult[], minutes = 60 * 24 * 30) {
  const now = Date.now();
  const cutoff = now - minutes * 60 * 1000;
  const filtered = history.filter(h => h.timestamp >= cutoff);
  const upCount = filtered.filter(h => h.status === "up").length;
  return filtered.length ? Math.round((upCount / filtered.length) * 10000) / 100 : 100;
}

function getStreak(history: PingResult[]) {
  if (history.length === 0) return { up: 0, down: 0 };
  let current = history[history.length - 1].status;
  let streak = 1;
  for (let i = history.length - 2; i >= 0; i--) {
    if (history[i].status === current) streak++;
    else break;
  }
  return current === "up" ? { up: streak * 5, down: 0 } : { up: 0, down: streak * 5 };
}

function aggregatePerMinute(history: PingResult[], minutes = 60) {
  // Gibt für die letzten `minutes` Minuten den Durchschnitt pro Minute zurück
  const now = Date.now();
  const result: number[] = [];
  for (let m = -minutes + 1; m <= 0; m++) {
    const t0 = now + m * 60 * 1000;
    const t1 = t0 + 60 * 1000;
    const entries = history.filter(h => h.timestamp >= t0 && h.timestamp < t1 && h.responseTime !== null);
    if (entries.length) {
      const avg = Math.round(entries.reduce((a, b) => a + (b.responseTime || 0), 0) / entries.length);
      result.push(avg);
    } else {
      result.push(0);
    }
  }
  return result;
}

export default function UptimeStatusPage() {
  const [history, setHistory] = useState<{ [site: string]: PingResult[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchAll = async () => {
      setLoading(true);
      const newHistory: { [site: string]: PingResult[] } = {};
      await Promise.all(SITES.map(async site => {
        const res = await fetch(`/api/uptime/get?site=${site.id}`);
        const data = await res.json();
        newHistory[site.id] = data;
      }));
      if (active) {
        setHistory(newHistory);
        setLoading(false);
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Uptime Status
      </Typography>
      <Stack spacing={4}>
        {SITES.map(site => {
          const hist = history[site.id] || [];
          const uptime = getUptime(hist);
          const streak = getStreak(hist);
          const lastResp = hist.length ? hist[hist.length - 1].responseTime : null;
          const lastStatus = hist.length ? hist[hist.length - 1].status : "down";
          const perMinute = aggregatePerMinute(hist, 60);
          const labels = perMinute.map((_, i) => `${60 - i}m`);
          return (
            <Card key={site.id} variant="outlined" sx={{ bgcolor: "background.paper" }}>
              <CardContent>
                <Typography variant="h5">{site.name}</Typography>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    label={lastStatus === "up" ? "Online" : "Offline"}
                    color={lastStatus === "up" ? "success" : "error"}
                    sx={{ fontWeight: "bold", fontSize: 16 }}
                  />
                  <Typography>
                    Uptime: <b>{uptime}%</b>
                  </Typography>
                  <Typography>
                    Aktuelle Response Time: <b>{lastResp ?? "?"} ms</b>
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Aktuelle Streak: {streak.up ? `${Math.floor(streak.up / 60)} min online` : `${Math.floor(streak.down / 60)} min offline`}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Average Response Time (letzte Stunde, pro Minute)</Typography>
                  <Paper sx={{ p: 1, bgcolor: "#222" }}>
                    <Line
                      height={150}
                      data={{
                        labels,
                        datasets: [
                          {
                            label: "Response Time (ms)",
                            data: perMinute,
                            borderColor: "#1976d2",
                            backgroundColor: "rgba(25, 118, 210, 0.2)",
                            fill: true,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                        },
                        scales: {
                          x: { display: false },
                          y: { beginAtZero: true },
                        },
                      }}
                    />
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
}
