// app/providers/ThemeProvider.tsx
"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ab47bc", // kräftiges Lila
      contrastText: "#fff",
    },
    secondary: {
      main: "#f06292", // Pink
      contrastText: "#fff",
    },
    background: {
      default: "#1a0025",
      paper: "#23113a",
    },
    text: {
      primary: "#f8eafd",
      secondary: "#b39ddb",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: 1,
        },
      },
    },
  },
});

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
