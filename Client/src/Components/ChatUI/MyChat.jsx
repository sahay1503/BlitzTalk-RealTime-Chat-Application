import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchChats, setSelectedChat } from "../../features/chat/chatSlice";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import { getSender, getSenderFull } from "../../Helpers/chatHelpers";
import GroupModal from "./GroupUI/GroupModal";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  if (diff < 86400000) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diff < 604800000) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const ChatItem = ({ chat, isSelected, loggedInUser, onClick, isOnline, unreadCount }) => {
  const isGroup = chat.isGroupChat;
  const name = isGroup ? chat.chatName : getSender(loggedInUser, chat.users);
  const senderFull = !isGroup && getSenderFull(loggedInUser, chat.users);
  const avatarSrc = isGroup ? null : senderFull?.pic;
  const lastMsg = chat.latestMessage;
  const lastMsgText = lastMsg
    ? `${lastMsg.sender?._id === loggedInUser?._id ? "You: " : ""}${lastMsg.content}`
    : "No messages yet";

  return (
    <Box onClick={onClick} sx={{
      display: "flex", alignItems: "center", gap: 1.5,
      px: 2, py: 1.2, cursor: "pointer", borderRadius: "8px",
      bgcolor: isSelected ? "action.selected" : "transparent",
      "&:hover": { bgcolor: isSelected ? "action.selected" : "action.hover" },
    }}>
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        {isGroup ? (
          <Box sx={{
            width: 40, height: 40, borderRadius: "10px",
            bgcolor: "primary.main",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <GroupsIcon sx={{ color: "white", fontSize: 18 }} />
          </Box>
        ) : (
          <Avatar src={avatarSrc} sx={{ width: 40, height: 40, fontSize: "0.875rem", bgcolor: "secondary.main" }}>
            {name?.[0]?.toUpperCase()}
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

      <Box flex={1} minWidth={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{
            fontSize: "0.875rem", fontWeight: isSelected ? 600 : 500,
            color: isSelected ? "primary.main" : "text.primary",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {name}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.8} flexShrink={0} ml={1}>
            {unreadCount > 0 && (
              <Box sx={{
                minWidth: 18, height: 18, borderRadius: "9px", px: 0.6,
                bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Typography sx={{ color: "white", fontSize: "0.65rem", fontWeight: 700, lineHeight: 1 }}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Typography>
              </Box>
            )}
            <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", whiteSpace: "nowrap" }}>
              {formatTime(lastMsg?.createdAt)}
            </Typography>
          </Box>
        </Box>
        <Typography sx={{
          fontSize: "0.775rem", color: "text.secondary",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mt: 0.2,
        }}>
          {lastMsgText}
        </Typography>
      </Box>
    </Box>
  );
};

const MyChat = ({ fetchAgain }) => {
  const [loggedInUser, setLoggedInUser] = React.useState();
  const dispatch = useDispatch();
  const { user, selectedChat, chats, onlineUsers, unreadCounts } = useSelector((state) => state.chat);

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")));
    if (!user) return;
    dispatch(fetchChats()).catch(() => toast.error("Failed to load chats"));
  }, [dispatch, user, fetchAgain]);

  if (!user) return null;

  return (
    <Box sx={{
      display: { xs: selectedChat ? "none" : "flex", md: "flex" },
      flexDirection: "column",
      minHeight: 0,
      width: { xs: "100%", md: "30%" },
      bgcolor: "background.paper",
      borderRadius: "10px",
      border: "1px solid",
      borderColor: "divider",
      overflow: "hidden",
      flexShrink: 0,
      alignSelf: "stretch",
    }}>
      <Box sx={{
        px: 2.5, py: 1.8,
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "text.primary" }}>
          Messages
        </Typography>
        <GroupModal>
          <Tooltip title="New group chat">
            <IconButton size="small" sx={{
              bgcolor: "action.hover", color: "text.secondary", borderRadius: "7px",
              "&:hover": { bgcolor: "action.selected", color: "primary.main" },
            }}>
              <GroupAddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </GroupModal>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 1, py: 1 }}>
        {!chats || chats.length === 0 ? (
          <Box px={1}>
            {[...Array(5)].map((_, i) => (
              <Box key={i} display="flex" alignItems="center" gap={1.5} px={1} py={1.2}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box flex={1}>
                  <Skeleton variant="text" width="55%" height={14} />
                  <Skeleton variant="text" width="75%" height={12} sx={{ mt: 0.5 }} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          chats.map((chat, i) => {
            const isGroup = chat.isGroupChat;
            const senderFull = !isGroup && getSenderFull(loggedInUser, chat.users);
            const isOnline = !isGroup && senderFull && onlineUsers.includes(senderFull._id);
            const unreadCount = unreadCounts[chat._id] || 0;
            return (
              <ChatItem
                key={chat._id || i}
                chat={chat}
                isSelected={selectedChat?._id === chat._id}
                loggedInUser={loggedInUser}
                isOnline={isOnline}
                unreadCount={unreadCount}
                onClick={() => dispatch(setSelectedChat(chat))}
              />
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default MyChat;
