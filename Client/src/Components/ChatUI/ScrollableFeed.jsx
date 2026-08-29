import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";
import TranslateIcon from "@mui/icons-material/Translate";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { isSameSender, isLastMessage, isSameUser } from "../../Helpers/chatHelpers";
import { countries } from "../../json/countries";
import axios from "axios";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Single message bubble with inline translate
const MessageBubble = ({ m, isOwn, showAvatar, reduceMargin, userLanguage }) => {
  const [translation, setTranslation] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async () => {
    // Toggle off if already showing
    if (showTranslation) {
      setShowTranslation(false);
      return;
    }
    // Use cached translation if available
    if (translation) {
      setShowTranslation(true);
      return;
    }
    const targetCode = countries[userLanguage];
    if (!targetCode) return;

    setTranslating(true);
    try {
      const { data } = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(m.content)}&langpair=autodetect|${targetCode}`
      );
      const translated = data?.responseData?.translatedText;
      if (translated && translated !== m.content) {
        setTranslation(translated);
        setShowTranslation(true);
      }
    } catch {
      // silently fail
    } finally {
      setTranslating(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: 1,
        mt: reduceMargin ? 0.4 : 1.5,
        px: 1,
      }}
    >
      {/* Avatar for others */}
      {!isOwn && (
        <Box sx={{ width: 32, flexShrink: 0, alignSelf: "flex-end" }}>
          {showAvatar ? (
            <Tooltip title={m.sender.name} placement="bottom-start">
              <Avatar src={m.sender.pic} sx={{ width: 30, height: 30, fontSize: 12 }}>
                {m.sender.name?.[0]}
              </Avatar>
            </Tooltip>
          ) : null}
        </Box>
      )}

      {/* Bubble + translation */}
      <Box sx={{ maxWidth: "65%", display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start" }}>
        {/* Sender name in group */}
        {!isOwn && !reduceMargin && (
          <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600, mb: 0.3, ml: 1.5, fontSize: "0.72rem" }}>
            {m.sender.name}
          </Typography>
        )}

        {/* Main bubble */}
        <Box sx={{
            px: 2, py: 0.9,
            borderRadius: isOwn ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            bgcolor: isOwn ? "primary.main" : "background.paper",
            color: isOwn ? "white" : "text.primary",
            boxShadow: isOwn ? "none" : "0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
            wordBreak: "break-word",
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{m.content}</Typography>
        </Box>

        {/* Translation bubble */}
        {showTranslation && translation && (
          <Box sx={{
            mt: 0.5, px: 1.5, py: 0.8,
            borderRadius: isOwn ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
            bgcolor: "action.hover",
            border: "1px solid", borderColor: "divider",
            maxWidth: "100%",
          }}>
            <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600, display: "block", mb: 0.2, fontSize: "0.7rem" }}>
              🌐 {userLanguage}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.5, fontSize: "0.8rem" }}>
              {translation}
            </Typography>
          </Box>
        )}

        {/* Timestamp + translate button row */}
        <Box display="flex" alignItems="center" gap={0.5} mt={0.3} sx={{ flexDirection: isOwn ? "row-reverse" : "row" }}>
          <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.68rem", mx: 0.5 }}>
            {formatTime(m.createdAt)}
          </Typography>
          {userLanguage && (
            <Tooltip title={showTranslation ? "Hide" : `Translate to ${userLanguage}`}>
              <IconButton size="small" onClick={handleTranslate} disabled={translating}
                sx={{ p: 0.3, color: showTranslation ? "primary.main" : "text.disabled", "&:hover": { color: "primary.main" } }}>
                {translating
                  ? <CircularProgress size={10} sx={{ color: "primary.main" }} />
                  : <TranslateIcon sx={{ fontSize: 11 }} />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const ScrollableChat = ({ messages }) => {
  const user = useSelector((state) => state.chat.user);

  return (
    <ScrollableFeed forceScroll={true} style={{ height: "100%", overflowY: "auto", padding: "0 4px" }}>
      {messages && messages.map((m, i) => (
        <MessageBubble
          key={m._id}
          m={m}
          isOwn={m.sender._id === user._id}
          showAvatar={isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)}
          reduceMargin={isSameUser(messages, m, i, user._id)}
          userLanguage={user.language}
        />
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
