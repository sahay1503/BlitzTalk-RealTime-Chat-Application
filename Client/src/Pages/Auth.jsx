import React, { useState, useEffect } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Login, Signup } from "../Components";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") === "signup" ? "signup" : "login");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  const isDark = theme.palette.mode === "dark";

  const panelBg = isDark
    ? "linear-gradient(160deg, #0F172A 0%, #1E293B 100%)"
    : "linear-gradient(160deg, #1B4FD8 0%, #1741B6 100%)";

  return (
    <Box sx={{
      minHeight: "calc(100vh - 56px)",
      display: "flex",
      bgcolor: "background.default",
    }}>

      {/* ── Left panel: branding / pitch ── */}
      <Box sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "center",
        width: "45%",
        flexShrink: 0,
        background: panelBg,
        px: { md: 6, lg: 8 },
        py: 6,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle background circle */}
        <Box sx={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          top: -150, right: -200, pointerEvents: "none",
        }} />
        <Box sx={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          bottom: -100, left: -100, pointerEvents: "none",
        }} />

        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1.5} mb={6}>
          <Box sx={{
            width: 36, height: 36, borderRadius: "10px",
            bgcolor: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ChatIcon sx={{ color: "white", fontSize: 20 }} />
          </Box>
          <Typography sx={{ color: "white", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.01em" }}>
            BlitzTalk
          </Typography>
        </Box>

        {tab === "login" ? (
          /* ── Shown when user is on Sign In ── */
          <Box>
            <Typography sx={{
              color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", mb: 2,
            }}>
              New to BlitzTalk?
            </Typography>
            <Typography sx={{
              color: "white", fontSize: { md: "1.9rem", lg: "2.2rem" },
              fontWeight: 700, lineHeight: 1.25, mb: 2.5, letterSpacing: "-0.02em",
            }}>
              Create your free account today
            </Typography>
            <Typography sx={{
              color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.7, mb: 5,
            }}>
              Join thousands of users already chatting in real time — with live translation
              and emotion detection built in.
            </Typography>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setTab("signup")}
              sx={{
                borderColor: "rgba(255,255,255,0.35)", color: "white",
                fontWeight: 600, px: 3, py: 1.2, borderRadius: "8px",
                "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              Create Account
            </Button>
          </Box>
        ) : (
          /* ── Shown when user is on Sign Up ── */
          <Box>
            <Typography sx={{
              color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", mb: 2,
            }}>
              Already have an account?
            </Typography>
            <Typography sx={{
              color: "white", fontSize: { md: "1.9rem", lg: "2.2rem" },
              fontWeight: 700, lineHeight: 1.25, mb: 2.5, letterSpacing: "-0.02em",
            }}>
              Welcome back. Sign in to continue
            </Typography>
            <Typography sx={{
              color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.7, mb: 5,
            }}>
              Your conversations, contacts, and settings are waiting for you.
              Sign in with your existing credentials.
            </Typography>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setTab("login")}
              sx={{
                borderColor: "rgba(255,255,255,0.35)", color: "white",
                fontWeight: 600, px: 3, py: 1.2, borderRadius: "8px",
                "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              Sign In
            </Button>
          </Box>
        )}

        {/* Bottom features list */}
        <Box mt={8} display="flex" flexDirection="column" gap={1.5}>
          {["Real-time messaging via Socket.IO", "Live chat translation (100+ languages)", "AI emotion detection"].map((f) => (
            <Box key={f} display="flex" alignItems="center" gap={1.5}>
              <Box sx={{
                width: 6, height: 6, borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.4)", flexShrink: 0,
              }} />
              <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem" }}>{f}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Right panel: form ── */}
      <Box sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: { xs: 3, sm: 6, md: 8 },
        py: 6,
        bgcolor: "background.paper",
        overflowY: "auto",
      }}>
        {/* Mobile-only logo */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.5, mb: 5 }}>
          <Box sx={{
            width: 34, height: 34, borderRadius: "9px", bgcolor: "primary.main",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ChatIcon sx={{ color: "white", fontSize: 18 }} />
          </Box>
          <Typography fontWeight={700} fontSize="1rem" color="text.primary">BlitzTalk</Typography>
        </Box>

        <Box sx={{ width: "100%", maxWidth: 400 }}>
          {tab === "login" ? <Login onSwitchToSignup={() => setTab("signup")} /> : <Signup onSwitchToLogin={() => setTab("login")} />}
        </Box>

        {/* Mobile toggle */}
        <Box sx={{ display: { xs: "flex", md: "none" }, mt: 4, gap: 1, alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">
            {tab === "login" ? "Don't have an account?" : "Already have an account?"}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "primary.main", fontWeight: 600, cursor: "pointer" }}
            onClick={() => setTab(tab === "login" ? "signup" : "login")}
          >
            {tab === "login" ? "Sign up" : "Sign in"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Auth;
