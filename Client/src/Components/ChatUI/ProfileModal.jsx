import React, { useState } from "react";
import {
  IconButton, Modal, Fade, Typography, Box, Avatar, Chip, Divider, Backdrop,
} from "@mui/material";
import { Close as CloseIcon, Visibility as ViewIcon, Email, Language, Person } from "@mui/icons-material";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);
  if (!user) return null;

  const initials = user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      {children ? (
        <span onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>{children}</span>
      ) : (
        <IconButton onClick={() => setOpen(true)} size="small"
          sx={{ color: "text.secondary", "&:hover": { color: "#6C63FF" } }}>
          <ViewIcon fontSize="small" />
        </IconButton>
      )}

      <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition
        BackdropComponent={Backdrop} BackdropProps={{ timeout: 400 }}>
        <Fade in={open}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90vw", sm: 380 },
            bgcolor: "background.paper",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
            outline: "none",
          }}>
            {/* Cover gradient */}
            <Box sx={{
              height: 110,
              background: "linear-gradient(135deg, #6C63FF 0%, #9B59B6 50%, #FF6584 100%)",
              position: "relative",
            }}>
              <IconButton onClick={() => setOpen(false)}
                sx={{
                  position: "absolute", top: 10, right: 10,
                  bgcolor: "rgba(0,0,0,0.25)", color: "white",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.4)" },
                  width: 32, height: 32,
                }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Avatar — overlaps cover */}
            <Box sx={{ px: 3, pb: 3 }}>
              <Box sx={{ mt: -6, mb: 2, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <Avatar
                  src={user.pic}
                  sx={{
                    width: 88, height: 88,
                    border: "4px solid white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    fontSize: 28, fontWeight: 700,
                    bgcolor: "#6C63FF",
                  }}
                >
                  {initials}
                </Avatar>
                {user.language && (
                  <Chip
                    icon={<Language sx={{ fontSize: 14 }} />}
                    label={user.language}
                    size="small"
                    sx={{
                      bgcolor: "rgba(108,99,255,0.1)", color: "#6C63FF",
                      border: "1px solid rgba(108,99,255,0.2)", fontWeight: 600, fontSize: 11,
                    }}
                  />
                )}
              </Box>

              {/* Name */}
              <Typography variant="h6" fontWeight={700} mb={0.3}>{user.name}</Typography>

              <Divider sx={{ my: 2 }} />

              {/* Info rows */}
              <Box display="flex" flexDirection="column" gap={1.5}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{
                    width: 34, height: 34, borderRadius: "10px",
                    bgcolor: "rgba(108,99,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Email sx={{ fontSize: 16, color: "#6C63FF" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" lineHeight={1}>Email</Typography>
                    <Typography variant="body2" fontWeight={500}>{user.email}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{
                    width: 34, height: 34, borderRadius: "10px",
                    bgcolor: "rgba(255,101,132,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Language sx={{ fontSize: 16, color: "#FF6584" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" lineHeight={1}>Preferred Language</Typography>
                    <Typography variant="body2" fontWeight={500}>{user.language || "Not set"}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ProfileModal;
