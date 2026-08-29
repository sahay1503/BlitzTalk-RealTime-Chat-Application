import { useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { MyChat, ChatBox } from "../Components";

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const user = useSelector((state) => state.chat.user);

  if (!user) return null;

  return (
    <Box sx={{
      display: "flex",
      flex: 1,
      alignItems: "stretch",
      gap: 1.5,
      p: 1.5,
      bgcolor: "background.default",
      minHeight: 0,
      overflow: "hidden",
    }}>
      <MyChat fetchAgain={fetchAgain} />
      <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chat;
