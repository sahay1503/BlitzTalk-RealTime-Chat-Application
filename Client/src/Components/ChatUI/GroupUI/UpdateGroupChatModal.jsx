import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../../../features/chat/chatSlice";
import { useDebounce } from "../../Hooks/useDebounce";
import { toast } from "react-toastify";
import {
  IconButton, Modal, Backdrop, Fade, Button, Typography, Box,
  Avatar, TextField, Chip, CircularProgress, InputBase, Divider, Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

let handleSearch;

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, selectedChat } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const debouncedSearch = useDebounce(search);
  const isAdmin = selectedChat?.groupAdmin?._id === user?._id;

  useEffect(() => {
    handleSearch = async (query) => {
      setSearch(query);
      if (!query) { setSearchResult([]); return; }
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/user?search=${query}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSearchResult(data);
      } catch {
        toast.error("Search failed");
      } finally {
        setLoading(false);
      }
    };
    handleSearch(debouncedSearch);
  }, [debouncedSearch, user.token]);

  const handleRename = async () => {
    if (!groupChatName.trim()) return;
    try {
      setRenameLoading(true);
      const { data } = await axios.patch("/api/chat/rename", {
        chatId: selectedChat._id, chatName: groupChatName,
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      dispatch(setSelectedChat(data));
      setFetchAgain(!fetchAgain);
      setEditingName(false);
      toast.success("Group renamed");
    } catch {
      toast.error("Failed to rename");
    } finally {
      setRenameLoading(false);
    }
  };

  const handleAddUser = async (u) => {
    if (selectedChat.users.find((m) => m._id === u._id)) {
      toast.error("Already in group"); return;
    }
    if (!isAdmin) { toast.error("Only admin can add members"); return; }
    try {
      setLoading(true);
      const { data } = await axios.put("/api/chat/groupadd", {
        chatId: selectedChat._id, userId: u._id,
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      dispatch(setSelectedChat(data));
      setFetchAgain(!fetchAgain);
      setSearch(""); setSearchResult([]);
      toast.success(`${u.name} added`);
    } catch {
      toast.error("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (u) => {
    if (!isAdmin && u._id !== user._id) {
      toast.error("Only admin can remove members"); return;
    }
    try {
      setLoading(true);
      const { data } = await axios.put("/api/chat/groupremove", {
        chatId: selectedChat._id, userId: u._id,
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      u._id === user._id ? dispatch(setSelectedChat(null)) : dispatch(setSelectedChat(data));
      setFetchAgain(!fetchAgain);
      fetchMessages();
      if (u._id === user._id) setOpen(false);
    } catch {
      toast.error("Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedChat) return null;

  const adminUser = selectedChat.groupAdmin;
  const memberCount = selectedChat.users?.length || 0;

  return (
    <>
      <Tooltip title="Group Info">
        <IconButton onClick={() => setOpen(true)} size="small"
          sx={{ color: "text.secondary", "&:hover": { color: "#6C63FF" } }}>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition
        BackdropComponent={Backdrop} BackdropProps={{ timeout: 400 }}>
        <Fade in={open}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92vw", sm: 420 },
            bgcolor: "background.paper",
            borderRadius: 4, overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
            outline: "none",
            maxHeight: "90vh", display: "flex", flexDirection: "column",
          }}>

            {/* ── Cover + Group Avatar ── */}
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Box sx={{
                height: 90,
                background: "linear-gradient(135deg, #6C63FF 0%, #9B59B6 50%, #FF6584 100%)",
              }} />
              <IconButton onClick={() => setOpen(false)} sx={{
                position: "absolute", top: 10, right: 10,
                bgcolor: "rgba(0,0,0,0.25)", color: "white", width: 30, height: 30,
                "&:hover": { bgcolor: "rgba(0,0,0,0.4)" },
              }}>
                <CloseIcon fontSize="small" />
              </IconButton>

              {/* Group avatar overlapping cover */}
              <Box sx={{ px: 3, mt: -4, mb: 1, display: "flex", alignItems: "flex-end", gap: 2 }}>
                <Box sx={{
                  width: 72, height: 72, borderRadius: "20px",
                  background: "linear-gradient(135deg, #6C63FF, #9B59B6)",
                  border: "4px solid white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(108,99,255,0.3)",
                  flexShrink: 0,
                }}>
                  <GroupsIcon sx={{ color: "white", fontSize: 32 }} />
                </Box>
                <Box pb={0.5} flex={1} minWidth={0}>
                  {/* Editable group name */}
                  {editingName ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <TextField
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                        size="small" autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleRename()}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: 14 } }}
                      />
                      <IconButton size="small" onClick={handleRename} disabled={renameLoading}
                        sx={{ bgcolor: "#6C63FF", color: "white", "&:hover": { bgcolor: "#5a52e0" }, width: 30, height: 30 }}>
                        {renameLoading ? <CircularProgress size={14} color="inherit" /> : <CheckIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography variant="h6" fontWeight={700} noWrap>{selectedChat.chatName}</Typography>
                      {isAdmin && (
                        <IconButton size="small" onClick={() => { setGroupChatName(selectedChat.chatName); setEditingName(true); }}
                          sx={{ color: "text.secondary", p: 0.3 }}>
                          <EditIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      )}
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Group · {memberCount} member{memberCount !== 1 ? "s" : ""}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* ── Scrollable content ── */}
            <Box sx={{ overflowY: "auto", flex: 1 }}>

              {/* Admin info */}
              <Box sx={{ px: 3, py: 1.5, bgcolor: "action.hover", borderTop: "1px solid", borderColor: "divider" }}>
                <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Created by
                </Typography>
                <Box display="flex" alignItems="center" gap={1.5} mt={1}>
                  <Avatar src={adminUser?.pic} sx={{ width: 32, height: 32, fontSize: 12 }}>{adminUser?.name?.[0]}</Avatar>
                  <Typography variant="body2" fontWeight={600}>{adminUser?.name}</Typography>
                  <Chip label="Admin" size="small" sx={{
                    bgcolor: "rgba(108,99,255,0.12)", color: "#6C63FF",
                    border: "1px solid rgba(108,99,255,0.25)", fontWeight: 700, fontSize: 10, height: 20,
                  }} />
                </Box>
              </Box>

              <Divider />

              {/* Members list */}
              <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Members ({memberCount})
                </Typography>
              </Box>

              {selectedChat.users?.map((u, i) => {
                const isMemberAdmin = u._id === adminUser?._id;
                const isMe = u._id === user._id;
                const canRemove = isAdmin || isMe;

                return (
                  <Box key={u._id}>
                    {i > 0 && <Divider sx={{ mx: 3 }} />}
                    <Box sx={{
                      display: "flex", alignItems: "center", gap: 1.5,
                      px: 3, py: 1.2,
                      "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                    }}>
                      <Avatar src={u.pic} sx={{ width: 40, height: 40, fontSize: 15 }}>{u.name?.[0]}</Avatar>
                      <Box flex={1} minWidth={0}>
                        <Box display="flex" alignItems="center" gap={0.8}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {u.name}{isMe ? " (You)" : ""}
                          </Typography>
                          {isMemberAdmin && (
                            <Chip label="Admin" size="small" sx={{
                              bgcolor: "rgba(108,99,255,0.1)", color: "#6C63FF",
                              border: "1px solid rgba(108,99,255,0.2)", fontWeight: 700, fontSize: 9, height: 18,
                            }} />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary" noWrap>{u.email}</Typography>
                      </Box>
                      {canRemove && !isMemberAdmin && (
                        <Tooltip title={isMe ? "Leave group" : "Remove"}>
                          <IconButton size="small" onClick={() => handleRemove(u)}
                            sx={{ color: "error.main", opacity: 0.7, "&:hover": { opacity: 1, bgcolor: "rgba(211,47,47,0.08)" } }}>
                            {isMe ? <ExitToAppIcon fontSize="small" /> : <PersonRemoveIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                );
              })}

              {/* Add member section — admin only */}
              {isAdmin && (
                <>
                  <Divider sx={{ mt: 1 }} />
                  <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
                      Add Member
                    </Typography>
                  </Box>
                  <Box sx={{ px: 3, pb: 2 }}>
                    <Box sx={{
                      display: "flex", alignItems: "center", gap: 1,
                      bgcolor: "background.default", borderRadius: "10px", px: 1.5, py: 0.8,
                      border: "1px solid", borderColor: "divider",
                      "&:focus-within": { borderColor: "primary.main", bgcolor: "background.paper" },
                    }}>
                      <SearchIcon sx={{ color: "text.disabled", fontSize: 18 }} />
                      <InputBase fullWidth placeholder="Search to add..."
                        value={search} onChange={(e) => handleSearch(e.target.value)}
                        sx={{ fontSize: 14 }} />
                      {loading && <CircularProgress size={14} sx={{ color: "primary.main" }} />}
                    </Box>

                    {searchResult.length > 0 && (
                      <Box sx={{
                        mt: 1, border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: "10px", overflow: "hidden",
                      }}>
                        {searchResult.slice(0, 4).map((u, i) => (
                          <Box key={u._id}>
                            {i > 0 && <Divider />}
                            <Box onClick={() => handleAddUser(u)} sx={{
                              display: "flex", alignItems: "center", gap: 1.5,
                              px: 2, py: 1, cursor: "pointer",
                              "&:hover": { bgcolor: "action.hover" },
                            }}>
                              <Avatar src={u.pic} sx={{ width: 30, height: 30, fontSize: 12 }}>{u.name?.[0]}</Avatar>
                              <Typography variant="body2" fontWeight={500} flex={1} noWrap>{u.name}</Typography>
                              <PersonAddIcon sx={{ fontSize: 16, color: "primary.main" }} />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </>
              )}

              {/* Leave group button for non-admins */}
              {!isAdmin && (
                <Box sx={{ px: 3, pb: 3, pt: 1 }}>
                  <Button
                    fullWidth variant="outlined" color="error"
                    startIcon={<ExitToAppIcon />}
                    onClick={() => handleRemove(user)}
                    sx={{ borderRadius: "10px", fontWeight: 600 }}
                  >
                    Leave Group
                  </Button>
                </Box>
              )}

              {/* Admin leave button */}
              {isAdmin && (
                <Box sx={{ px: 3, pb: 3 }}>
                  <Button
                    fullWidth variant="outlined" color="error"
                    startIcon={<ExitToAppIcon />}
                    onClick={() => handleRemove(user)}
                    sx={{ borderRadius: "10px", fontWeight: 600 }}
                  >
                    Leave & Transfer Admin
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
