import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";

const pinkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f06292", // Pink
      contrastText: "#fff",
    },
    secondary: {
      main: "#ab47bc", // Lila als Secondary
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
});

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={pinkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
