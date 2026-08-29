import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().chat;
      const response = await axios.get("/api/chat", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch chats");
    }
  }
);

const initialState = {
  selectedChat: null,
  user: JSON.parse(localStorage.getItem("userInfo")) || null,
  notification: [],
  chats: [],
  emotion: "",
  onlineUsers: [],
  unreadCounts: {},
  darkMode: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      const chat = action.payload;
      state.selectedChat = chat;
      // Clear unread count when chat is opened
      if (chat?._id) {
        state.unreadCounts[chat._id] = 0;
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    setNotification: (state, action) => {
      // If array passed (for filtering), replace; if single item, prepend
      if (Array.isArray(action.payload)) {
        state.notification = action.payload;
      } else {
        state.notification = [action.payload, ...state.notification];
      }
    },
    setChats: (state, action) => {
      // Deduplicate — don't add if already exists
      const exists = state.chats.find((c) => c._id === action.payload._id);
      if (!exists) {
        state.chats = [action.payload, ...state.chats];
      }
    },
    setEmotion: (state, action) => {
      state.emotion = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    incrementUnread: (state, action) => {
      const chatId = action.payload;
      state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => { state.chats = []; })
      .addCase(fetchChats.rejected, (state) => { state.chats = []; })
      .addCase(fetchChats.fulfilled, (state, action) => { state.chats = action.payload; });
  },
});

export const {
  setSelectedChat, setUser, setNotification, setChats,
  setEmotion, setOnlineUsers, incrementUnread, toggleDarkMode,
} = chatSlice.actions;

export default chatSlice.reducer;
