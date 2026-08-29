import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        cursor: "pointer",
        bgcolor: "action.hover",
        "&:hover": { bgcolor: "action.selected" },
        width: "100%",
        display: "flex",
        alignItems: "center",
        px: 2, py: 1,
        mb: 1,
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Avatar sx={{ mr: 1.5, width: 32, height: 32 }} alt={user.name} src={user.pic} />
      <Box>
        <Typography variant="body2" fontWeight={500} color="text.primary">{user.name}</Typography>
        <Typography variant="caption" color="text.secondary">{user.email}</Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
