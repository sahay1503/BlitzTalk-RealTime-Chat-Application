import { ArrowBack, Send, EmojiEmotions, Translate, ClearAll } from "@mui/icons-material";
import EmojiPickerReact from "emoji-picker-react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setSelectedChat, setEmotion } from "../../features/chat/chatSlice";
import {
  IconButton, Typography, Box, CircularProgress, Avatar,
  InputBase, Tooltip, ClickAwayListener,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Menu, MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupsIcon from "@mui/icons-material/Groups";
import { getSender, getSenderFull } from "../../Helpers/chatHelpers";
import { detectEmotion } from "../../Helpers/detectEmotion";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./GroupUI/UpdateGroupChatModal";
import ScrollableFeed from "./ScrollableFeed";
import Lottie from "react-lottie";
import typingOptions from "../../json/typing.json";
import { countries } from "../../json/countries";
import axios from "axios";
import { getSocket } from "../../hooks/useSocket";

const defaultOptions = {
  loop: true, autoplay: true, animationData: typingOptions,
  rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
};

const getLanguageCode = (name) => countries[name] || null;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [isEmoteOn, setIsEmoteOn] = useState(false);
  const [isTranslateOn, setIsTranslateOn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, messageId: null });

  const { user, selectedChat, emotion, onlineUsers } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const selectedChatRef = useRef(selectedChat);
  useEffect(() => { selectedChatRef.current = selectedChat; }, [selectedChat]);

  const closeConfirm = () => setConfirmDialog({ open: false, type: null, messageId: null });

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    const handleLocalMessage = (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
    };
    socket.on("__local_message", handleLocalMessage);
    return () => {
      socket.off("__local_message", handleLocalMessage);
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(data);
      setLoading(false);
      getSocket()?.emit("join chat", selectedChat._id);
    } catch {
      toast.error("Failed to fetch messages");
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const socket = getSocket();
    socket?.emit("stop typing", selectedChat._id);
    setShowEmojiPicker(false);

    const senderLanguage = user.language || "English";
    let messageContent = newMessage;

    if (isTranslateOn && selectedChat.users?.length === 2) {
      const receiver = selectedChat.users.find((u) => u.email !== user.email && u.language !== senderLanguage);
      if (receiver) {
        const from = getLanguageCode(senderLanguage);
        const to = getLanguageCode(receiver.language);
        if (from && to) {
          try {
            const { data } = await axios.get(
              `https://api.mymemory.translated.net/get?q=${encodeURIComponent(newMessage)}&langpair=${from}|${to}`
            );
            if (data?.responseData?.translatedText) messageContent = data.responseData.translatedText;
          } catch { /* fallback */ }
        }
      }
    }

    if (isEmoteOn) {
      const emojiMap = {
        hello: "🙏", bye: "👋🏼", excited: "🤩", ashamed: "😳", calm: "😌",
        joy: "😂", love: "❤️", sad: "😔", irritated: "😠", angry: "😡",
        bored: "😒", curious: "🤔", blank: "❓",
      };
      const emoji = emojiMap[detectEmotion(newMessage) || emotion];
      if (emoji) messageContent += ` ${emoji}`;
    }

    try {
      const res = await axios.post("/api/message", { content: messageContent, chatId: selectedChat._id }, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      });
      socket?.emit("new message", res.data);
      setMessages((prev) => {
        if (prev.some((m) => m._id === res.data._id)) return prev;
        return [...prev, res.data];
      });
      setNewMessage("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send");
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`/api/message/${messageId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
    closeConfirm();
  };

  const clearChat = async () => {
    try {
      await axios.delete(`/api/message/clear/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages([]);
      toast.success("Chat cleared");
    } catch {
      toast.error("Failed to clear chat");
    }
    closeConfirm();
    setMenuAnchor(null);
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    const socket = getSocket();
    if (!socketConnected || !socket) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    const lastTypingTime = new Date().getTime();
    setTimeout(() => {
      if (new Date().getTime() - lastTypingTime >= 3000 && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  useEffect(() => { fetchMessages(); }, [selectedChat]);

  const isGroup = selectedChat?.isGroupChat;
  const senderFull = !isGroup && selectedChat && getSenderFull(user, selectedChat.users);
  const chatName = isGroup ? selectedChat?.chatName : getSender(user, selectedChat?.users || []);
  const isOnline = !isGroup && senderFull && onlineUsers.includes(senderFull._id);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>

      {/* ── Header ── */}
      <Box sx={{
        display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0,
        px: 2, py: 1.2, borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper",
      }}>
        <IconButton size="small" sx={{ display: { xs: "flex", md: "none" }, color: "text.secondary" }}
          onClick={() => dispatch(setSelectedChat(""))}>
          <ArrowBack sx={{ fontSize: 18 }} />
        </IconButton>

        {/* Avatar */}
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          {isGroup ? (
            <Box sx={{
              width: 38, height: 38, borderRadius: "9px",
              bgcolor: "primary.main",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <GroupsIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
          ) : (
            <Avatar src={senderFull?.pic} sx={{ width: 38, height: 38, fontSize: "0.875rem", bgcolor: "secondary.main" }}>
              {chatName?.[0]?.toUpperCase()}
            </Avatar>
          )}
          {isOnline && (
            <Box sx={{
              position: "absolute", bottom: 0, right: 0,
              width: 10, height: 10, borderRadius: "50%",
              bgcolor: "success.main", border: "2px solid",
              borderColor: "background.paper",
            }} />
          )}
        </Box>

        {/* Name + status */}
        <Box flex={1} minWidth={0}>
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#0F172A" }} noWrap>
            {chatName}
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: isOnline ? "success.main" : "text.disabled" }}>
            {isGroup ? `${selectedChat?.users?.length} members` : isOnline ? "Online" : "Offline"}
          </Typography>
        </Box>

        {/* Feature toggles */}
        {!isGroup && (
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title={isEmoteOn ? "Emotion detection ON" : "Emotion detection OFF"}>
              <Box
                onClick={() => setIsEmoteOn(!isEmoteOn)}
                sx={{
                  display: "flex", alignItems: "center", gap: 0.6,
                  px: 1.2, py: 0.5, borderRadius: "20px", cursor: "pointer",
                  border: "1px solid",
                  borderColor: isEmoteOn ? "primary.main" : "divider",
                  bgcolor: isEmoteOn ? "primary.main" : "transparent",
                  transition: "all 0.18s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: isEmoteOn ? "primary.dark" : "action.hover",
                  },
                }}
              >
                <EmojiEmotions sx={{ fontSize: 13, color: isEmoteOn ? "white" : "text.secondary" }} />
                <Typography sx={{
                  fontSize: "0.7rem", fontWeight: 600, lineHeight: 1,
                  color: isEmoteOn ? "white" : "text.secondary",
                  userSelect: "none",
                }}>
                  Emote
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip title={isTranslateOn ? "Auto-translate ON" : "Auto-translate OFF"}>
              <Box
                onClick={() => setIsTranslateOn(!isTranslateOn)}
                sx={{
                  display: "flex", alignItems: "center", gap: 0.6,
                  px: 1.2, py: 0.5, borderRadius: "20px", cursor: "pointer",
                  border: "1px solid",
                  borderColor: isTranslateOn ? "primary.main" : "divider",
                  bgcolor: isTranslateOn ? "primary.main" : "transparent",
                  transition: "all 0.18s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: isTranslateOn ? "primary.dark" : "action.hover",
                  },
                }}
              >
                <Translate sx={{ fontSize: 13, color: isTranslateOn ? "white" : "text.secondary" }} />
                <Typography sx={{
                  fontSize: "0.7rem", fontWeight: 600, lineHeight: 1,
                  color: isTranslateOn ? "white" : "text.secondary",
                  userSelect: "none",
                }}>
                  Translate
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        )}

        {isGroup
          ? <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
          : <ProfileModal user={senderFull} />
        }

        <Tooltip title="More">
          <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{ color: "text.disabled", "&:hover": { color: "text.secondary" } }}>
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem
            onClick={() => { setMenuAnchor(null); setConfirmDialog({ open: true, type: "clear", messageId: null }); }}
            sx={{ gap: 1.5, color: "#DC2626", fontSize: "0.875rem" }}
          >
            <ClearAll sx={{ fontSize: 16 }} /> Clear Chat
          </MenuItem>
        </Menu>
      </Box>

      {/* ── Messages ── */}
      <Box sx={{
        flex: 1, minHeight: 0, overflowY: "auto", px: 2, py: 1.5,
        bgcolor: "background.default", display: "flex", flexDirection: "column",
      }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
            <CircularProgress size={28} sx={{ color: "primary.main" }} />
          </Box>
        ) : (
          <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
            <ScrollableFeed
              messages={messages}
              emotion={emotion}
              onDeleteMessage={(id) => setConfirmDialog({ open: true, type: "message", messageId: id })}
            />
          </Box>
        )}
      </Box>

      {/* ── Typing indicator ── */}
      {istyping && (
        <Box sx={{ px: 2, py: 0.5, bgcolor: "background.default" }}>
          <Box sx={{
            display: "inline-flex", alignItems: "center", gap: 1,
            bgcolor: "background.paper", borderRadius: "12px 12px 12px 4px",
            px: 1.5, py: 0.8,
            border: "1px solid", borderColor: "divider",
          }}>
            <Lottie options={defaultOptions} width={36} style={{ margin: 0 }} />
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>typing...</Typography>
          </Box>
        </Box>
      )}

      {/* ── Input bar ── */}
      <Box sx={{ flexShrink: 0, position: "relative", borderTop: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
        {showEmojiPicker && (
          <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
            <Box sx={{ position: "absolute", bottom: "100%", left: 8, zIndex: 100, mb: 1 }}>
              <EmojiPickerReact
                onEmojiClick={(e) => setNewMessage((p) => p + e.emoji)}
                height={360} width={300}
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
              />
            </Box>
          </ClickAwayListener>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1.2 }}>
          <Tooltip title="Emoji">
            <IconButton size="small" onClick={() => setShowEmojiPicker((p) => !p)} sx={{
              color: showEmojiPicker ? "primary.main" : "text.disabled", flexShrink: 0,
              "&:hover": { color: "primary.main" },
            }}>
              <EmojiEmotions sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Box sx={{
            flex: 1, display: "flex", alignItems: "center",
            bgcolor: "background.default", borderRadius: "8px", px: 1.5, py: 0.6,
            border: "1px solid", borderColor: "divider",
            "&:focus-within": { borderColor: "primary.main", bgcolor: "background.paper" },
          }}>
            <InputBase
              fullWidth placeholder="Write a message..."
              value={newMessage} onChange={typingHandler}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              sx={{ fontSize: "0.875rem" }}
            />
          </Box>

          <IconButton onClick={sendMessage} disabled={!newMessage.trim()} sx={{
            width: 34, height: 34, flexShrink: 0, borderRadius: "8px",
            bgcolor: newMessage.trim() ? "primary.main" : "action.hover",
            color: newMessage.trim() ? "white" : "text.disabled",
            "&:hover": { bgcolor: newMessage.trim() ? "primary.dark" : "action.selected" },
          }}>
            <Send sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      {/* ── Confirm Dialog ── */}
      <Dialog open={confirmDialog.open} onClose={closeConfirm}
        PaperProps={{ sx: { borderRadius: "10px", minWidth: 320, border: "none" } }}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: "0.95rem", pb: 1 }}>
          {confirmDialog.type === "clear" ? "Clear Chat" : "Delete Message"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
            {confirmDialog.type === "clear"
              ? "All messages in this chat will be permanently deleted. This cannot be undone."
              : "This message will be permanently deleted. This cannot be undone."}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={closeConfirm} variant="outlined" size="small"
            sx={{ borderRadius: "7px", borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "text.disabled" } }}>
            Cancel
          </Button>
          <Button
            onClick={() => confirmDialog.type === "clear" ? clearChat() : deleteMessage(confirmDialog.messageId)}
            variant="contained" color="error" size="small"
            sx={{ borderRadius: "7px" }}
          >
            {confirmDialog.type === "clear" ? "Clear All" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default SingleChat;
