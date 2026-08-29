import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box, Typography, Button, Grid, Card, CardContent,
  Container, Chip, Avatar, useTheme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import TranslateIcon from "@mui/icons-material/Translate";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import BoltIcon from "@mui/icons-material/Bolt";
import GroupsIcon from "@mui/icons-material/Groups";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import ForumIcon from "@mui/icons-material/Forum";

const features = [
  {
    icon: <BoltIcon sx={{ fontSize: 20 }} />,
    title: "Lightning Fast",
    desc: "Real-time messaging powered by Socket.IO with zero perceptible delay.",
  },
  {
    icon: <TranslateIcon sx={{ fontSize: 20 }} />,
    title: "Live Translation",
    desc: "Auto-translates messages to your preferred language in real time across 100+ languages.",
  },
  {
    icon: <EmojiEmotionsIcon sx={{ fontSize: 20 }} />,
    title: "Emotion Detection",
    desc: "NLP engine reads the mood of your messages and suggests expressive emojis automatically.",
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 20 }} />,
    title: "Group Chats",
    desc: "Create and manage group conversations with custom names and member controls.",
  },
  {
    icon: <LockIcon sx={{ fontSize: 20 }} />,
    title: "Secure Auth",
    desc: "JWT-based authentication keeps your account and conversations private.",
  },
  {
    icon: <ChatIcon sx={{ fontSize: 20 }} />,
    title: "Rich Messaging",
    desc: "Send text, emojis, and files. Delete messages or clear entire conversations.",
  },
];

const steps = [
  { icon: <PersonAddIcon />, step: "01", title: "Create Account", desc: "Sign up in seconds with your name, email, and preferred language." },
  { icon: <SearchIcon />, step: "02", title: "Find People", desc: "Search for friends or colleagues by name and start a chat instantly." },
  { icon: <ForumIcon />, step: "03", title: "Start Talking", desc: "Send messages in real time with translation and emotion detection." },
];

const reviews = [
  { name: "Priya Sharma", role: "Product Designer", avatar: "P", rating: 5, text: "The live translation feature is a game changer for our international team. Clean and fast." },
  { name: "James Okafor", role: "Software Engineer", avatar: "J", rating: 5, text: "Emotion detection is surprisingly accurate. Adds a fun layer I didn't know I needed." },
  { name: "Mei Lin", role: "Marketing Lead", avatar: "M", rating: 5, text: "Finally a chat app that feels modern. The UI is clean and everything just works." },
  { name: "Arjun Patel", role: "Startup Founder", avatar: "A", rating: 5, text: "We replaced our old tool with BlitzTalk. Real-time, reliable, excellent group management." },
];

const Landing = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.chat.user);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleCTA = () => navigate(user ? "/chats" : "/auth");

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", color: "text.primary" }}>

      {/* ── HERO ── */}
      <Box sx={{
        minHeight: "88vh", display: "flex", alignItems: "center",
        borderBottom: "1px solid", borderColor: "divider",
        position: "relative", overflow: "hidden",
      }}>
        {/* Subtle top-right glow — single, restrained */}
        <Box sx={{
          position: "absolute", width: 700, height: 700, borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(27,79,216,0.08) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(27,79,216,0.06) 0%, transparent 65%)",
          top: -200, right: -200, pointerEvents: "none",
        }} />

        <Container maxWidth="md" sx={{ textAlign: "center", position: "relative", zIndex: 1, py: 10 }}>
          <Chip
            label="Real-Time · Translated · Emotional"
            size="small"
            sx={{
              mb: 4, fontWeight: 500, fontSize: "0.75rem",
              bgcolor: isDark ? "rgba(27,79,216,0.12)" : "rgba(27,79,216,0.07)",
              color: "primary.main",
              border: "1px solid",
              borderColor: isDark ? "rgba(27,79,216,0.25)" : "rgba(27,79,216,0.2)",
            }}
          />

          <Typography sx={{
            fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4rem" },
            fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em",
            color: "text.primary", mb: 3,
          }}>
            Chat at the speed{" "}
            <Box component="span" sx={{ color: "primary.main" }}>of thought</Box>
          </Typography>

          <Typography sx={{
            fontSize: { xs: "1rem", md: "1.1rem" },
            color: "text.secondary", maxWidth: 520, mx: "auto", mb: 5,
            lineHeight: 1.75, fontWeight: 400,
          }}>
            BlitzTalk combines real-time messaging, live translation, and emotion detection
            into one clean, fast application.
          </Typography>

          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleCTA}
              sx={{ fontWeight: 600, px: 3.5, py: 1.4, fontSize: "0.9rem" }}
            >
              {user ? "Open Chats" : "Get Started Free"}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              sx={{
                fontWeight: 500, px: 3.5, py: 1.4, fontSize: "0.9rem",
                borderColor: "divider", color: "text.secondary",
                "&:hover": { borderColor: "text.secondary", bgcolor: "action.hover" },
              }}
            >
              See Features
            </Button>
          </Box>

          {/* Stats row */}
          <Box display="flex" justifyContent="center" gap={{ xs: 4, md: 7 }} mt={9} flexWrap="wrap">
            {[["Socket.IO", "Real-Time"], ["100+", "Languages"], ["99.9%", "Uptime"], ["MIT", "Open Source"]].map(([val, label]) => (
              <Box key={label} textAlign="center">
                <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: "text.primary" }}>{val}</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "text.disabled", mt: 0.3 }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── FEATURES ── */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 }, borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Box mb={7}>
            <Typography sx={{
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "primary.main", mb: 1.5,
            }}>
              Features
            </Typography>
            <Typography sx={{
              fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700,
              letterSpacing: "-0.02em", color: "text.primary", maxWidth: 480,
            }}>
              Everything you need to connect
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {features.map((f) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <Card sx={{
                  height: "100%", border: "1px solid", borderColor: "divider",
                  bgcolor: "background.paper", borderRadius: "10px",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: isDark
                      ? "0 0 0 1px rgba(27,79,216,0.3)"
                      : "0 4px 20px rgba(27,79,216,0.08)",
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: "9px", mb: 2.5,
                      bgcolor: isDark ? "rgba(27,79,216,0.12)" : "rgba(27,79,216,0.07)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "primary.main",
                    }}>
                      {f.icon}
                    </Box>
                    <Typography variant="body1" fontWeight={600} color="text.primary" mb={1}>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                      {f.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── HOW IT WORKS ── */}
      <Box id="how-it-works" sx={{ py: { xs: 8, md: 12 }, borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Box mb={7}>
            <Typography sx={{
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "primary.main", mb: 1.5,
            }}>
              How It Works
            </Typography>
            <Typography sx={{
              fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700,
              letterSpacing: "-0.02em", color: "text.primary",
            }}>
              Up and running in 3 steps
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {steps.map((s, i) => (
              <Grid item xs={12} md={4} key={s.step}>
                <Box sx={{
                  p: 3.5, border: "1px solid", borderColor: "divider",
                  borderRadius: "10px", height: "100%", position: "relative",
                  bgcolor: "background.paper",
                  transition: "border-color 0.2s",
                  "&:hover": { borderColor: "primary.main" },
                }}>
                  <Typography sx={{
                    position: "absolute", top: 20, right: 24,
                    fontSize: "2.8rem", fontWeight: 900, lineHeight: 1,
                    color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                  }}>
                    {s.step}
                  </Typography>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: "10px", mb: 2.5,
                    bgcolor: isDark ? "rgba(27,79,216,0.12)" : "rgba(27,79,216,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "primary.main",
                  }}>
                    {s.icon}
                  </Box>
                  <Typography variant="body1" fontWeight={600} color="text.primary" mb={1}>
                    {s.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {s.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── REVIEWS ── */}
      <Box id="reviews" sx={{ py: { xs: 8, md: 12 }, borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Box mb={7}>
            <Typography sx={{
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "primary.main", mb: 1.5,
            }}>
              Reviews
            </Typography>
            <Typography sx={{
              fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700,
              letterSpacing: "-0.02em", color: "text.primary",
            }}>
              Loved by real users
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {reviews.map((r) => (
              <Grid item xs={12} sm={6} key={r.name}>
                <Card sx={{
                  height: "100%", border: "1px solid", borderColor: "divider",
                  bgcolor: "background.paper", borderRadius: "10px",
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" gap={0.3} mb={2.5}>
                      {[...Array(r.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ fontSize: 15, color: "#F59E0B" }} />
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.75} mb={3}>
                      "{r.text}"
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ width: 36, height: 36, fontSize: "0.8rem", fontWeight: 700, bgcolor: "primary.main" }}>
                        {r.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="text.primary">{r.name}</Typography>
                        <Typography variant="caption" color="text.disabled">{r.role}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA ── */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="sm">
          <Box sx={{
            textAlign: "center", p: { xs: 4, md: 6 },
            border: "1px solid", borderColor: "divider",
            borderRadius: "12px", bgcolor: "background.paper",
          }}>
            <Typography sx={{
              fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700,
              letterSpacing: "-0.02em", color: "text.primary", mb: 1.5,
            }}>
              Ready to get started?
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4} lineHeight={1.7}>
              Free forever. No credit card required. Start chatting in seconds.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleCTA}
              sx={{ fontWeight: 600, px: 4, py: 1.4, fontSize: "0.9rem" }}
            >
              {user ? "Go to Chats" : "Create Free Account"}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{ py: 3.5, borderTop: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{
                width: 26, height: 26, borderRadius: "7px", bgcolor: "primary.main",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ChatIcon sx={{ color: "white", fontSize: 14 }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "text.secondary" }}>
                BlitzTalk
              </Typography>
            </Box>
            <Typography variant="caption" color="text.disabled">
              © 2024 BlitzTalk. Built with MERN + Socket.IO.
            </Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default Landing;
