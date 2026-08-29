import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setOnlineUsers, setNotification, setEmotion, incrementUnread } from "../features/chat/chatSlice";

const ENDPOINT = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

// Singleton socket — one connection for the entire app lifetime
let socketInstance = null;

export const useSocket = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.chat.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const notification = useSelector((state) => state.chat.notification);
  const selectedChatRef = useRef(selectedChat);
  const notificationRef = useRef(notification);

  // Keep refs in sync so socket callbacks always see latest values
  useEffect(() => { selectedChatRef.current = selectedChat; }, [selectedChat]);
  useEffect(() => { notificationRef.current = notification; }, [notification]);

  useEffect(() => {
    if (!user) return;

    if (!socketInstance) {
      socketInstance = io(ENDPOINT, { transports: ["websocket"] });
    }

    socketInstance.emit("setup", user);

    socketInstance.on("connected", () => {
      console.log("Socket connected");
    });

    // Online users list from server
    socketInstance.on("online users", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      // Don't disconnect on unmount — keep singleton alive
    };
  }, [user]);

  // Message received handler — handles BOTH current chat and notifications
  useEffect(() => {
    if (!socketInstance) return;

    const handleMessage = (newMsg) => {
      dispatch(setEmotion(newMsg.answer));
      const currentChat = selectedChatRef.current;
      if (currentChat && currentChat._id === newMsg.chat._id) {
        // In this chat — dispatch to a global messages event that SingleChat listens to
        socketInstance.emit("__local_message", newMsg);
      } else {
        // Not in this chat — notification + unread
        const alreadyNotified = notificationRef.current.some((n) => n._id === newMsg._id);
        if (!alreadyNotified) {
          dispatch(setNotification(newMsg));
          dispatch(incrementUnread(newMsg.chat._id));
        }
      }
    };

    socketInstance.on("message recieved", handleMessage);
    return () => socketInstance.off("message recieved", handleMessage);
  }, [dispatch]);

  return socketInstance;
};

export const getSocket = () => socketInstance;
