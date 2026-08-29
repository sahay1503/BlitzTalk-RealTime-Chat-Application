import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Box, Typography, Button, Avatar, IconButton,
  Menu, MenuItem, Divider, Tooltip, Badge, Popover,
  List, ListItem, ListItemText, ListItemAvatar,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { setUser, setSelectedChat, setNotification, toggleDarkMode } from "../../features/chat/chatSlice";
import ProfileModal from "../ChatUI/ProfileModal";
import CustomDrawer from "../ChatUI/CustomDrawer";

// Consistent icon color for all toolbar icons — now handled via theme tokens

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.chat.user);
  const notifications = useSelector((state) => state.chat.notification);
  const darkMode = useSelector((state) => state.chat.darkMode);

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isLanding = location.pathname === "/";
  const isChat = location.pathname === "/chats";

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    dispatch(setUser(null));
    setAnchorElUser(null);
    navigate("/");
  };

  const handleNotifClick = (notif) => {
    dispatch(setSelectedChat(notif.chat));
    dispatch(setNotification(notifications.filter((n) => n !== notif)));
    setNotifAnchor(null);
    navigate("/chats");
  };

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: 1300,
      }}>
        <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: "56px !important", gap: 1 }}>

          {/* Brand */}
          <Box display="flex" alignItems="center" gap={1} sx={{ cursor: "pointer", mr: 2 }}
            onClick={() => navigate("/")}>
            <Box sx={{
              width: 30, height: 30, borderRadius: "7px",
              bgcolor: "primary.main",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChatIcon sx={{ color: "white", fontSize: 16 }} />
            </Box>
            <Typography sx={{
              fontWeight: 700, fontSize: "0.95rem", color: "text.primary", letterSpacing: "0.01em",
            }}>
              BlitzTalk
            </Typography>
          </Box>

          {/* Landing nav links */}
          {isLanding && (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
              {[["features", "Features"], ["how-it-works", "How It Works"], ["reviews", "Reviews"]].map(([id, label]) => (
                <Button key={id}
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                  sx={{
                    color: "text.secondary", fontSize: "0.8rem", fontWeight: 400,
                    px: 1.5, py: 0.8, borderRadius: "6px",
                    "&:hover": { color: "text.primary", bgcolor: "action.hover" },
                  }}>
                  {label}
                </Button>
              ))}
            </Box>
          )}

          <Box flex={1} />

          {/* Logged OUT */}
          {!user && (
            <Box display="flex" gap={1} alignItems="center">
              <Tooltip title={darkMode ? "Light mode" : "Dark mode"}>
                <IconButton size="small" onClick={() => dispatch(toggleDarkMode())}
                  sx={{ color: "text.secondary", "&:hover": { color: "text.primary", bgcolor: "action.hover" } }}>
                  {darkMode
                    ? <LightModeOutlinedIcon sx={{ fontSize: 18 }} />
                    : <DarkModeOutlinedIcon sx={{ fontSize: 18 }} />}
                </IconButton>
              </Tooltip>
              <Button onClick={() => navigate("/auth")} sx={{
                color: "text.secondary", fontSize: "0.85rem", fontWeight: 500,
                px: 1.5, borderRadius: "6px",
                "&:hover": { color: "text.primary", bgcolor: "action.hover" },
              }}>
                Sign In
              </Button>
              <Button variant="contained" onClick={() => navigate("/auth")} sx={{
                fontSize: "0.85rem", fontWeight: 500,
                px: 2, py: 0.8, borderRadius: "6px",
              }}>
                Get Started
              </Button>
            </Box>
          )}

          {/* Logged IN */}
          {user && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Tooltip title={darkMode ? "Light mode" : "Dark mode"}>
                <IconButton size="small" onClick={() => dispatch(toggleDarkMode())}
                  sx={{ color: "text.secondary", "&:hover": { color: "text.primary", bgcolor: "action.hover" } }}>
                  {darkMode
                    ? <LightModeOutlinedIcon sx={{ fontSize: 18 }} />
                    : <DarkModeOutlinedIcon sx={{ fontSize: 18 }} />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Search people">
                <IconButton size="small" onClick={() => setDrawerOpen(true)}
                  sx={{ color: "text.secondary", "&:hover": { color: "text.primary", bgcolor: "action.hover" } }}>
                  <SearchIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>

              {!isChat && (
                <Button onClick={() => navigate("/chats")} sx={{
                  color: "text.secondary", fontSize: "0.8rem", fontWeight: 500,
                  px: 1.5, mx: 0.5, borderRadius: "6px", border: "1px solid", borderColor: "divider",
                  "&:hover": { color: "text.primary", bgcolor: "action.hover", borderColor: "text.disabled" },
                }}>
                  Open Chats
                </Button>
              )}

              <Tooltip title="Notifications">
                <IconButton size="small" onClick={(e) => setNotifAnchor(e.currentTarget)}
                  sx={{ color: "text.secondary", "&:hover": { color: "text.primary", bgcolor: "action.hover" } }}>
                  <Badge badgeContent={notifications?.length || 0} color="error"
                    sx={{ "& .MuiBadge-badge": { fontSize: 10, minWidth: 16, height: 16 } }}>
                    <NotificationsOutlinedIcon sx={{ fontSize: 18 }} />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title={user.name}>
                <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0.5, ml: 0.5 }}>
                  <Avatar src={user.pic} sx={{
                    width: 30, height: 30, fontSize: "0.75rem", fontWeight: 600,
                    bgcolor: "primary.main", border: "1.5px solid", borderColor: "divider",
                  }}>
                    {user.name?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar sx={{ minHeight: "56px !important", flexShrink: 0 }} />

      {/* Notification popover */}
      <Popover open={Boolean(notifAnchor)} anchorEl={notifAnchor}
        onClose={() => setNotifAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 300, borderRadius: 2, mt: 0.5 } }}>
        <Box px={2} py={1.5} borderBottom="1px solid" sx={{ borderColor: "divider" }}>
          <Typography variant="body2" fontWeight={600} color="text.primary">Notifications</Typography>
        </Box>
        {!notifications?.length ? (
          <Box px={2} py={3} textAlign="center">
            <Typography variant="caption" color="text.secondary">No new notifications</Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {notifications.map((n, i) => (
              <ListItem key={i} button onClick={() => handleNotifClick(n)}
                sx={{ px: 2, py: 1, "&:hover": { bgcolor: "action.hover" } }}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar src={n.sender?.pic} sx={{ width: 32, height: 32, fontSize: "0.75rem" }}>
                    {n.sender?.name?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="body2" fontWeight={500}>{n.sender?.name}</Typography>}
                  secondary={<Typography variant="caption" color="text.secondary" noWrap>{n.content}</Typography>}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>

      {/* User menu */}
      <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)}
        onClose={() => setAnchorElUser(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { mt: 0.5, minWidth: 190 } }}>
        <Box px={2} py={1.5}>
          <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
        </Box>
        <Divider />
        {user && (
          <ProfileModal user={user}>
            <MenuItem sx={{ gap: 1.5 }}>
              <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2">Profile</Typography>
            </MenuItem>
          </ProfileModal>
        )}
        <MenuItem onClick={logoutHandler} sx={{ gap: 1.5, color: "error.main" }}>
          <LogoutIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2">Sign out</Typography>
        </MenuItem>
      </Menu>

      <CustomDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
