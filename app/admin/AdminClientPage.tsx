"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

type Post = { id: number; title: string; content: string; createdAt: string };

export default function AdminClientPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) {
      setSnackbar({
        open: true,
        message: "Fehler beim Erstellen des Beitrags.",
        severity: "error",
      });
      return;
    }
    const newPost = await res.json();
    setPosts([...posts, newPost]);
    setTitle("");
    setContent("");
    setSnackbar({
      open: true,
      message:
        "Beitrag erstellt. Änderungen können bis zu 1 Minute dauern, bis sie überall sichtbar sind.",
      severity: "success",
    });
  }

  async function handleDelete(id: number) {
    const res = await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setSnackbar({
        open: true,
        message: "Fehler beim Löschen des Beitrags.",
        severity: "error",
      });
      return;
    }
    setPosts(posts.filter((p) => p.id !== id));
    if (editId === id) setEditId(null);
    setSnackbar({
      open: true,
      message:
        "Beitrag gelöscht. Änderungen können bis zu 1 Minute dauern, bis sie überall sichtbar sind.",
      severity: "success",
    });
  }

  function handleEditSelect(post: Post) {
    setEditId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  }

  async function handleApplyEdit(e: React.FormEvent) {
    e.preventDefault();
    if (editId === null) return;
    const res = await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, title: editTitle, content: editContent }),
    });
    if (!res.ok) {
      setSnackbar({
        open: true,
        message: "Fehler beim Bearbeiten des Beitrags.",
        severity: "error",
      });
      return;
    }
    const updated = await res.json();
    setPosts(posts.map((p) => (p.id === editId ? updated : p)));
    setEditId(null);
    setEditTitle("");
    setEditContent("");
    setSnackbar({
      open: true,
      message:
        "Beitrag bearbeitet. Änderungen können bis zu 1 Minute dauern, bis sie überall sichtbar sind.",
      severity: "success",
    });
  }

  function handleEditCancel() {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
  }

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Admin Bereich
      </Typography>

      {/* Beitrag erstellen */}
      <Card variant="outlined" sx={{ mb: 5, bgcolor: "background.paper" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Neuen Beitrag erstellen
          </Typography>
          <Box
            component="form"
            onSubmit={handleAdd}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Titel"
              variant="outlined"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              fullWidth
            />
            <ReactQuill
              value={content}
              onChange={setContent}
              theme="snow"
              placeholder="Inhalt"
              style={{ borderRadius: 8, marginBottom: 8 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ alignSelf: "flex-end" }}
            >
              Beitrag erstellen
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Beiträge verwalten
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Typography color="text.secondary">Beiträge werden geladen...</Typography>
      ) : posts.length === 0 ? (
        <Typography color="text.secondary">Keine Beiträge vorhanden.</Typography>
      ) : (
        <Stack spacing={3}>
          {posts.map((post) => (
            <Card key={post.id} variant="outlined" sx={{ bgcolor: "background.paper" }}>
              <CardContent>
                {editId === post.id ? (
                  <Box
                    component="form"
                    onSubmit={handleApplyEdit}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <TextField
                      label="Titel"
                      variant="outlined"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      required
                      fullWidth
                    />
                    <ReactQuill
                      value={editContent}
                      onChange={setEditContent}
                      theme="snow"
                      placeholder="Inhalt"
                      style={{ borderRadius: 8, marginBottom: 8 }}
                    />
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button type="submit" variant="contained" color="primary">
                        Speichern
                      </Button>
                      <Button variant="outlined" color="inherit" onClick={handleEditCancel}>
                        Abbrechen
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="h6" color="primary">
                        {post.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                        {new Date(post.createdAt).toLocaleDateString("de-DE")}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        style={{ color: "#ededed" }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button size="small" variant="text" onClick={() => handleEditSelect(post)}>
                        Editieren
                      </Button>
                      <Button size="small" variant="text" color="error" onClick={() => handleDelete(post.id)}>
                        Löschen
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Snackbar für Hinweise */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Inline Dark Theme für React Quill */}
      <style jsx global>{`
        .ql-toolbar {
          background: #181c22;
          border: 1px solid #222;
          border-radius: 8px 8px 0 0;
        }
        .ql-toolbar .ql-picker-label,
        .ql-toolbar .ql-picker-item,
        .ql-toolbar button {
          color: #e0e0e0;
        }
        .ql-toolbar button:hover,
        .ql-toolbar .ql-picker-label:hover,
        .ql-toolbar .ql-picker-item:hover,
        .ql-toolbar button.ql-active {
          color: #90caf9;
          background: #23272f;
        }
        .ql-container {
          background: #121212;
          color: #e0e0e0;
          border: 1px solid #222;
          border-radius: 0 0 8px 8px;
          min-height: 150px;
        }
        .ql-editor {
          background: #121212;
          color: #e0e0e0;
          min-height: 150px;
          padding: 12px;
        }
        .ql-editor a {
          color: #90caf9;
        }
        .ql-editor strong {
          color: #fff;
        }
        .ql-editor::-webkit-scrollbar {
          width: 8px;
        }
        .ql-editor::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
      `}</style>
    </Container>
  );
}
