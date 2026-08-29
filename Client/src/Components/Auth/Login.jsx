import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/chat/chatSlice";
import {
  Button, TextField, InputAdornment, IconButton, Box, Typography,
  CircularProgress, Divider,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { toast } from "react-toastify";

const Login = ({ onSwitchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!email || !password) { toast.warning("Please fill all fields"); return; }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/login", { email, password }, {
        headers: { "Content-type": "application/json" },
      });
      toast.success("Welcome back!");
      localStorage.setItem("userInfo", JSON.stringify(data));
      dispatch(setUser(data));
      setLoading(false);
      setTimeout(() => navigate("/chats"), 800);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box mb={1}>
        <Typography variant="h5" fontWeight={700} color="text.primary" letterSpacing="-0.02em">
          Sign in
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Enter your credentials to access your account
        </Typography>
      </Box>

      <TextField
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: "text.disabled" }} /></InputAdornment>,
        }}
      />

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        onKeyDown={(e) => e.key === "Enter" && submitHandler()}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: "text.disabled" }} /></InputAdornment>,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                {showPassword ? <Visibility sx={{ fontSize: 18 }} /> : <VisibilityOff sx={{ fontSize: 18 }} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        size="large"
        onClick={submitHandler}
        disabled={loading}
        fullWidth
        sx={{ py: 1.4, fontWeight: 600, fontSize: "0.9rem" }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : "Sign In"}
      </Button>

      <Divider>
        <Typography variant="caption" color="text.disabled">or</Typography>
      </Divider>

      <Button
        variant="outlined"
        size="large"
        fullWidth
        onClick={() => { setEmail("guest@example.com"); setPassword("123456"); }}
        sx={{ py: 1.3, fontWeight: 500, color: "text.secondary", borderColor: "divider" }}
      >
        Continue as Guest
      </Button>
    </Box>
  );
};

export default Login;
