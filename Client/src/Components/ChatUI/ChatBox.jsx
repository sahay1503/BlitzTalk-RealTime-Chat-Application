import React from "react";
import { Box, Typography } from "@mui/material";
import SingleChat from "./SingleChat";
import { useSelector } from "react-redux";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  return (
    <Box sx={{
      flex: 1, minHeight: 0, alignSelf: "stretch",
      display: { xs: selectedChat ? "flex" : "none", md: "flex" },
      flexDirection: "column",
      bgcolor: "background.paper",
      borderRadius: "10px",
      border: "1px solid",
      borderColor: "divider",
      overflow: "hidden",
    }}>
      {selectedChat ? (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      ) : (
        <Box sx={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 1.5,
          bgcolor: "background.default",
        }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: "14px",
            bgcolor: "action.hover", border: "1px solid",
            borderColor: "divider",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 26, color: "text.disabled" }} />
          </Box>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "text.secondary" }}>
            No conversation selected
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "text.disabled", textAlign: "center", maxWidth: 240 }}>
            Select a chat from the left or search for someone to message
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Chatbox;
