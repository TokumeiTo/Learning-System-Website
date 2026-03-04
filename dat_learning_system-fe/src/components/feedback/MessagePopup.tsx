import React from "react";
import { Snackbar, Alert } from "@mui/material";

export type MessagePopupProps = {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  onClose: () => void;
};

const MessagePopup: React.FC<MessagePopupProps> = ({ open, message, severity = "info", onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MessagePopup;
