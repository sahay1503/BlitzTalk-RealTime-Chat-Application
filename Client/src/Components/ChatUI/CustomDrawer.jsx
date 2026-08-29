import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import axios from "axios";
import { setChats, setSelectedChat } from "../../features/chat/chatSlice";

const UserRow = ({ user, onClick, loading }) => (
  <Box onClick={onClick} sx={{
    display: "flex", alignItems: "center", gap: 1.5,
    px: 2.5, py: 1.2, cursor: "pointer",
    "&:hover": { bgcolor: "action.hover" },
    opacity: loading ? 0.6 : 1,
  }}>
    <Avatar src={user.pic} sx={{ width: 38, height: 38, fontSize: "0.875rem", bgcolor: "secondary.main" }}>
      {user.name?.[0]}
    </Avatar>
    <Box>
      <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "text.primary" }}>{user.name}</Typography>
      <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{user.email}</Typography>
    </Box>
  </Box>
);

export default function CustomDrawer({ isOpen, onClose }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const user = useSelector((state) => state.chat.user);
  const chats = useSelector((state) => state.chat.chats);
  const dispatch = useDispatch();

  const handleSearch = async (value) => {
    setSearch(value);
    if (!value.trim()) { setSearchResult([]); return; }
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${value}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSearchResult(data);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post("/api/chat", { userId }, {
        headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` },
      });
      if (!chats.find((c) => c._id === data._id)) dispatch(setChats(data));
      dispatch(setSelectedChat(data));
      setLoadingChat(false);
      onClose();
      setSearch("");
      setSearchResult([]);
    } catch {
      toast.error("Could not open chat");
      setLoadingChat(false);
    }
  };

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={() => { onClose(); setSearch(""); setSearchResult([]); }}
      PaperProps={{ sx: { width: 300, borderRadius: "0 10px 10px 0", border: "none", boxShadow: "4px 0 24px rgba(0,0,0,0.08)" } }}
    >
      {/* Header */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: 2.5, py: 1.8, bgcolor: "#0F172A",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "white" }}>Find People</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "white" } }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Search */}
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Box sx={{
          display: "flex", alignItems: "center", gap: 1,
          bgcolor: "background.default", borderRadius: "8px", px: 1.5, py: 0.8,
          border: "1px solid", borderColor: "divider",
          "&:focus-within": { borderColor: "primary.main", bgcolor: "background.paper" },
        }}>
          <SearchIcon sx={{ color: "text.disabled", fontSize: 16 }} />
          <InputBase
            fullWidth placeholder="Search by name..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
            sx={{ fontSize: "0.875rem" }}
          />
          {loading && <CircularProgress size={14} sx={{ color: "primary.main" }} />}
        </Box>
      </Box>

      <Divider sx={{ borderColor: "divider" }} />

      {/* Results */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {!search && (
          <Box px={2.5} py={4} textAlign="center">
            <Typography sx={{ fontSize: "0.8rem", color: "text.disabled" }}>
              Type a name to search
            </Typography>
          </Box>
        )}
        {search && !loading && searchResult.length === 0 && (
          <Box px={2.5} py={4} textAlign="center">
            <Typography sx={{ fontSize: "0.8rem", color: "text.disabled" }}>No users found</Typography>
          </Box>
        )}
        {searchResult.map((u) => (
          <UserRow key={u._id} user={u} onClick={() => accessChat(u._id)} loading={loadingChat} />
        ))}
        {loadingChat && (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={20} sx={{ color: "primary.main" }} />
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
