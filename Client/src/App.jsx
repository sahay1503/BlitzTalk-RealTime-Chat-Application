import { Route, Routes } from "react-router-dom";
import { Landing, Auth, Chat } from "./Pages";
import Navbar from "./Components/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const darkMode = useSelector((state) => state.chat.darkMode);
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ToastContainer position="bottom-right" theme={darkMode ? "dark" : "light"} />
      <Navbar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/chats" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
