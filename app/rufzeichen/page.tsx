"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";

export default function RufzeichenPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/rufzeichen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rufzeichen: input.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unbekannter Fehler");
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Fehler bei der Abfrage");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", py: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Rufzeichenabfrage
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Rufzeichen"
            value={input}
            onChange={e => setInput(e.target.value)}
            required
            inputProps={{ style: { textTransform: "uppercase" } }}
            autoFocus
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !input.trim()}
          >
            {loading ? <CircularProgress size={20} /> : "Suchen"}
          </Button>
        </Box>
      </form>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {result && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Ergebnis
          </Typography>
          <Typography><b>Rufzeichen:</b> {result.rufzeichen}</Typography>
          <Typography><b>Klasse:</b> {result.klasse}</Typography>
          <Typography><b>Inhaber:</b> {result.inhaber}</Typography>
          <Typography><b>Betriebsort:</b> {result.betriebsort}</Typography>
        </Paper>
      )}
    </Box>
  );
}
