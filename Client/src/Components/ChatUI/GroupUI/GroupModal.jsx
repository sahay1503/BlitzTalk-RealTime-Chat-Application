import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChats } from "../../../features/chat/chatSlice";
import { useDebounce } from "../../Hooks/useDebounce";
import { toast } from "react-toastify";
import {
  IconButton, Modal, Backdrop, Fade, Button, Typography, Box,
  Avatar, TextField, Chip, CircularProgress, InputBase, Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

let handleSearch;

const GroupModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const debouncedSearch = useDebounce(search);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.chat.user);

  const handleClose = () => {
    setOpen(false);
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast.error("Already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    setSearch("");
    setSearchResult([]);
  };

  const removeUser = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
  };

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

  const handleSubmit = async () => {
    if (!groupChatName.trim()) { toast.warning("Enter a group name"); return; }
    if (selectedUsers.length < 2) { toast.warning("Add at least 2 members"); return; }
    setCreating(true);
    try {
      const { data } = await axios.post("/api/chat/group", {
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
        name: groupChatName,
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      dispatch(setChats(data));
      toast.success("Group created!");
      handleClose();
    } catch {
      toast.error("Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>

      <Modal open={open} onClose={handleClose} closeAfterTransition
        BackdropComponent={Backdrop} BackdropProps={{ timeout: 400 }}>
        <Fade in={open}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92vw", sm: 440 },
            bgcolor: "background.paper",
            borderRadius: 4, overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
            outline: "none",
          }}>
            {/* Header */}
            <Box sx={{
              background: "linear-gradient(135deg, #6C63FF 0%, #9B59B6 100%)",
              px: 3, py: 2.5, display: "flex", alignItems: "center", gap: 2,
            }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: "14px",
                bgcolor: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <GroupsIcon sx={{ color: "white", fontSize: 24 }} />
              </Box>
              <Box flex={1}>
                <Typography variant="h6" fontWeight={700} color="white">New Group</Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Add a name and members
                </Typography>
              </Box>
              <IconButton onClick={handleClose} sx={{ color: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ px: 3, py: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Group name */}
              <TextField
                label="Group Name"
                variant="outlined"
                fullWidth
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                size="small"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />

              {/* Search members */}
              <Box sx={{
                display: "flex", alignItems: "center", gap: 1,
                bgcolor: "background.default", borderRadius: "10px", px: 1.5, py: 0.8,
                border: "1px solid", borderColor: "divider",
                "&:focus-within": { borderColor: "primary.main", bgcolor: "background.paper" },
              }}>
                <SearchIcon sx={{ color: "text.disabled", fontSize: 18 }} />
                <InputBase
                  fullWidth placeholder="Search people to add..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  sx={{ fontSize: 14 }}
                />
                {loading && <CircularProgress size={14} sx={{ color: "primary.main" }} />}
              </Box>

              {/* Selected members chips */}
              {selectedUsers.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                  {selectedUsers.map((u) => (
                    <Chip
                      key={u._id}
                      avatar={<Avatar src={u.pic} sx={{ width: 22, height: 22 }}>{u.name?.[0]}</Avatar>}
                      label={u.name}
                      onDelete={() => removeUser(u)}
                      size="small"
                      sx={{
                        bgcolor: "rgba(108,99,255,0.1)", color: "#6C63FF",
                        border: "1px solid rgba(108,99,255,0.2)", fontWeight: 600,
                        "& .MuiChip-deleteIcon": { color: "#6C63FF", "&:hover": { color: "#9B59B6" } },
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* Search results */}
              {searchResult.length > 0 && (
                <Box sx={{
                  border: "1px solid rgba(0,0,0,0.08)", borderRadius: "10px",
                  overflow: "hidden", maxHeight: 200, overflowY: "auto",
                }}>
                  {searchResult.slice(0, 5).map((u, i) => (
                    <Box key={u._id}>
                      {i > 0 && <Divider />}
                      <Box
                        onClick={() => handleGroup(u)}
                        sx={{
                          display: "flex", alignItems: "center", gap: 1.5,
                          px: 2, py: 1.2, cursor: "pointer",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <Avatar src={u.pic} sx={{ width: 34, height: 34, fontSize: 13 }}>{u.name?.[0]}</Avatar>
                        <Box flex={1} minWidth={0}>
                          <Typography variant="body2" fontWeight={600} noWrap>{u.name}</Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>{u.email}</Typography>
                        </Box>
                        <PersonAddIcon sx={{ fontSize: 16, color: "primary.main" }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Member count hint */}
              <Typography variant="caption" color="text.secondary">
                {selectedUsers.length} member{selectedUsers.length !== 1 ? "s" : ""} selected
                {selectedUsers.length < 2 ? " — need at least 2" : " ✓"}
              </Typography>

              {/* Create button */}
              <Button
                variant="contained" fullWidth size="large"
                onClick={handleSubmit}
                disabled={creating || !groupChatName.trim() || selectedUsers.length < 2}
                sx={{
                  background: "linear-gradient(135deg, #6C63FF, #9B59B6)",
                  boxShadow: "0 4px 15px rgba(108,99,255,0.35)",
                  borderRadius: "10px", py: 1.3, fontWeight: 700,
                }}
              >
                {creating ? <CircularProgress size={20} color="inherit" /> : "Create Group"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default GroupModal;
