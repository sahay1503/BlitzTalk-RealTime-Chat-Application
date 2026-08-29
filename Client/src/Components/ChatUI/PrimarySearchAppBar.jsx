import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileModal from "./ProfileModal";
import CustomDrawer from "./CustomDrawer";
import { setNotification, setUser, setSelectedChat } from "../../features/chat/chatSlice";
import { getSender } from "../../Helpers/chatHelpers";

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 10,
  backgroundColor: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.1)",
  "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: "6px 14px",
  gap: 8,
  minWidth: 200,
}));

export default function PrimarySearchAppBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.chat.user);
  const notifications = useSelector((state) => state.chat.notification);

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

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
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar sx={{ gap: 2, px: { xs: 2, md: 3 } }}>
          {/* Brand */}
          <Box display="flex" alignItems="center" gap={1} mr={2}>
            <Box sx={{
              width: 32, height: 32, borderRadius: "8px",
              background: "linear-gradient(135deg, #6C63FF, #9B59B6)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChatIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color="white" sx={{ display: { xs: "none", sm: "block" } }}>
              BlitzTalk
            </Typography>
          </Box>

          {/* Search trigger */}
          <SearchWrapper onClick={() => setDrawerOpen(true)}>
            <SearchIcon sx={{ color: "rgba(255,255,255,0.4)", fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)" }}>
              Search people...
            </Typography>
          </SearchWrapper>

          <Box flex={1} />

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)} sx={{ color: "rgba(255,255,255,0.7)" }}>
              <Badge badgeContent={notifications?.length || 0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Avatar menu */}
          <Tooltip title={user?.name}>
            <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar
                alt={user?.name}
                src={user?.pic}
                sx={{ width: 36, height: 36, border: "2px solid rgba(108,99,255,0.6)" }}
              />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Notification popover */}
      <Popover
        open={Boolean(notifAnchor)}
        anchorEl={notifAnchor}
        onClose={() => setNotifAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 320, borderRadius: 3, mt: 1, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" } }}
      >
        <Box px={2} py={1.5} borderBottom="1px solid #f0f0f0">
          <Typography fontWeight={600} variant="body1">Notifications</Typography>
        </Box>
        {!notifications?.length ? (
          <Box px={2} py={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">No new notifications</Typography>
          </Box>
        ) : (
          <List dense>
            {notifications.map((n, i) => (
              <ListItem key={i} button onClick={() => handleNotifClick(n)}
                sx={{ "&:hover": { bgcolor: "rgba(108,99,255,0.06)" } }}>
                <ListItemAvatar>
                  <Avatar src={n.sender?.pic} sx={{ width: 36, height: 36 }}>{n.sender?.name?.[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="body2" fontWeight={600}>{n.sender?.name}</Typography>}
                  secondary={<Typography variant="caption" color="text.secondary" noWrap>{n.content}</Typography>}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>

      {/* User menu */}
      <Menu
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={() => setAnchorElUser(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { borderRadius: 3, mt: 1, minWidth: 180, boxShadow: "0 10px 40px rgba(0,0,0,0.15)" } }}
      >
        <Box px={2} py={1.5}>
          <Typography fontWeight={600} variant="body2">{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
        </Box>
        <Divider />
        <ProfileModal user={user}>
          <MenuItem sx={{ gap: 1.5, py: 1.2 }}>
            <PersonIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2">View Profile</Typography>
          </MenuItem>
        </ProfileModal>
        <MenuItem onClick={logoutHandler} sx={{ gap: 1.5, py: 1.2, color: "error.main" }}>
          <LogoutIcon fontSize="small" />
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>

      <CustomDrawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
      <ToastContainer theme="dark" position="bottom-right" />
    </>
  );
}
