import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./store/store.js";
import { Provider, useSelector } from "react-redux";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useSocket } from "./hooks/useSocket.js";

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Light: clean white surfaces, #1B4FD8 accent (professional blue)
// Dark:  #0F172A base (Slate-900), #1E293B surfaces (Slate-800)
const ACCENT       = "#1B4FD8";   // Professional blue — Slack/Linear style
const ACCENT_HOVER = "#1741B6";
const ACCENT_LIGHT = "#EFF3FF";   // Tint for selected states

const buildTheme = (dark) => createTheme({
  palette: {
    mode: dark ? "dark" : "light",
    primary:    { main: ACCENT, dark: ACCENT_HOVER, light: ACCENT_LIGHT, contrastText: "#fff" },
    secondary:  { main: "#64748B" },   // Slate-500 — neutral secondary
    error:      { main: "#DC2626" },
    success:    { main: "#16A34A" },
    background: {
      default: dark ? "#0F172A" : "#F8FAFC",   // Slate-50 light / Slate-900 dark
      paper:   dark ? "#1E293B" : "#FFFFFF",   // Slate-800 dark / white light
    },
    divider: dark ? "rgba(255,255,255,0.08)" : "#E2E8F0",
    text: {
      primary:   dark ? "#F1F5F9" : "#0F172A",   // Slate-100 / Slate-900
      secondary: dark ? "#94A3B8" : "#64748B",   // Slate-400 / Slate-500
      disabled:  dark ? "#475569" : "#CBD5E1",
    },
    action: {
      hover:    dark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.04)",
      selected: dark ? "rgba(27,79,216,0.15)"  : "rgba(27,79,216,0.08)",
    },
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontSize: 14,
    fontWeightRegular: 400,
    fontWeightMedium:  500,
    fontWeightBold:    600,
    h1: { fontSize: "2rem",    fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontSize: "1.5rem",  fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.01em" },
    h4: { fontSize: "1.125rem",fontWeight: 600 },
    h5: { fontSize: "1rem",    fontWeight: 600 },
    h6: { fontSize: "0.9rem",  fontWeight: 600 },
    body1:   { fontSize: "0.9rem",  lineHeight: 1.6 },
    body2:   { fontSize: "0.825rem",lineHeight: 1.5 },
    caption: { fontSize: "0.75rem", lineHeight: 1.4, color: "#64748B" },
    button:  { textTransform: "none", fontWeight: 500, fontSize: "0.875rem", letterSpacing: "0.01em" },
  },

  shape: { borderRadius: 8 },

  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.05)",
    "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
    "0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
    "0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.04)",
    "0 20px 25px rgba(0,0,0,0.08), 0 10px 10px rgba(0,0,0,0.03)",
    ...Array(19).fill("none"),
  ],

  components: {
    // ── Button ──────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 7,
          padding: "7px 16px",
          fontWeight: 500,
          fontSize: "0.875rem",
        },
        containedPrimary: {
          backgroundColor: ACCENT,
          "&:hover": { backgroundColor: ACCENT_HOVER },
        },
        outlinedPrimary: {
          borderColor: ACCENT,
          color: ACCENT,
          "&:hover": { backgroundColor: ACCENT_LIGHT, borderColor: ACCENT_HOVER },
        },
      },
    },

    // ── Input ────────────────────────────────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 7,
          fontSize: "0.875rem",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E1" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#94A3B8" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: ACCENT, borderWidth: 1.5 },
        },
      },
    },

    // ── Paper ────────────────────────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
        },
      },
    },

    // ── AppBar ───────────────────────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },

    // ── Chip ─────────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500, fontSize: "0.75rem" },
      },
    },

    // ── Avatar ───────────────────────────────────────────────────────────────
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: "0.875rem" },
      },
    },

    // ── Tooltip ──────────────────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#0F172A",
          fontSize: "0.75rem",
          fontWeight: 500,
          borderRadius: 5,
          padding: "5px 10px",
        },
      },
    },

    // ── Menu ─────────────────────────────────────────────────────────────────
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
          boxShadow: dark ? "0 10px 25px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)" : "0 10px 25px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 400,
          borderRadius: 5,
          margin: "2px 4px",
          padding: "7px 12px",
          "&:hover": { backgroundColor: dark ? "rgba(255,255,255,0.06)" : "#F1F5F9" },
        },
      },
    },

    // ── Dialog ───────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 12, border: "none" },
      },
    },

    // ── Switch ───────────────────────────────────────────────────────────────
    MuiSwitch: {
      styleOverrides: {
        root: { padding: 6 },
        thumb: { width: 14, height: 14, margin: 2 },
        track: { borderRadius: 8 },
        switchBase: {
          "&.Mui-checked": { color: ACCENT },
          "&.Mui-checked + .MuiSwitch-track": { backgroundColor: ACCENT },
        },
      },
    },

    // ── Divider ──────────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: dark ? "rgba(255,255,255,0.08)" : "#E2E8F0" },
      },
    },
  },
});

function AppWithTheme() {
  const darkMode = useSelector((state) => state.chat.darkMode);
  const theme = buildTheme(darkMode);
  useSocket();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWithTheme />
    </Provider>
  </React.StrictMode>
);
