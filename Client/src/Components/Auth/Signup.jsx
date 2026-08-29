import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button, TextField, InputAdornment, IconButton, Box, Typography,
  CircularProgress, Avatar, LinearProgress, Autocomplete,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Person, Language, CloudUpload } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/chat/chatSlice";
import { countries } from "../../json/countries";

const LANGUAGE_OPTIONS = Object.keys(countries).sort();

const Signup = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [language, setLanguage] = useState(null);
  const [pic, setPic] = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [picLoading, setPicLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postDetails = async (file) => {
    if (!file) return;
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast.error("Only JPEG/PNG images allowed"); return;
    }
    setPicPreview(URL.createObjectURL(file));
    setPicLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ChatApp");
      formData.append("cloud_name", "dgvy8j9np");
      const { data } = await axios.post(import.meta.env.VITE_CLOUDINARY, formData);
      setPic(data.url);
      toast.success("Photo uploaded!");
    } catch {
      toast.error("Photo upload failed");
      setPicPreview(null);
    } finally {
      setPicLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmpassword || !language) {
      toast.warning("Please fill all fields"); return;
    }
    if (password !== confirmpassword) {
      toast.error("Passwords do not match"); return;
    }
    setPicLoading(true);
    try {
      const { data } = await axios.post("/api/user", { name, email, password, language, pic }, {
        headers: { "Content-type": "application/json" },
      });
      toast.success("Account created!");
      localStorage.setItem("userInfo", JSON.stringify(data));
      dispatch(setUser(data));
      setPicLoading(false);
      navigate("/chats");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      setPicLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2.5}>
      <Box mb={0.5}>
        <Typography variant="h5" fontWeight={700} color="text.primary" letterSpacing="-0.02em">
          Create account
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Fill in the details below to get started
        </Typography>
      </Box>

      {/* Avatar upload */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar src={picPreview} sx={{ width: 52, height: 52, bgcolor: "action.selected", border: "2px solid", borderColor: "divider" }}>
          {name ? name[0]?.toUpperCase() : <Person sx={{ color: "text.disabled" }} />}
        </Avatar>
        <Button
          component="label"
          variant="outlined"
          size="small"
          startIcon={picLoading ? <CircularProgress size={13} /> : <CloudUpload sx={{ fontSize: 16 }} />}
          disabled={picLoading}
          sx={{ borderColor: "divider", color: "text.secondary", fontWeight: 500, borderRadius: "7px",
            "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
        >
          {picLoading ? "Uploading..." : "Upload Photo"}
          <input type="file" accept="image/*" hidden onChange={(e) => postDetails(e.target.files[0])} />
        </Button>
      </Box>
      {picLoading && <LinearProgress sx={{ borderRadius: 4 }} />}

      <TextField
        label="Full Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth
        InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ fontSize: 18, color: "text.disabled" }} /></InputAdornment> }}
      />

      <TextField
        label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth
        InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: "text.disabled" }} /></InputAdornment> }}
      />

      <Autocomplete
        options={LANGUAGE_OPTIONS}
        value={language}
        onChange={(_, val) => setLanguage(val)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Preferred Language"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start"><Language sx={{ fontSize: 18, color: "text.disabled" }} /></InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <TextField
        label="Password" type={showPassword ? "text" : "password"}
        value={password} onChange={(e) => setPassword(e.target.value)} fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: "text.disabled" }} /></InputAdornment>,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                {showPassword ? <Visibility sx={{ fontSize: 18 }} /> : <VisibilityOff sx={{ fontSize: 18 }} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Confirm Password" type={showPassword ? "text" : "password"}
        value={confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)} fullWidth
        InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: "text.disabled" }} /></InputAdornment> }}
      />

      <Button
        variant="contained" size="large" onClick={submitHandler}
        disabled={picLoading} fullWidth
        sx={{ py: 1.4, fontWeight: 600, fontSize: "0.9rem", mt: 0.5 }}
      >
        {picLoading ? <CircularProgress size={20} color="inherit" /> : "Create Account"}
      </Button>
    </Box>
  );
};

export default Signup;
