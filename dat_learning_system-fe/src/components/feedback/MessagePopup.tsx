import React from "react";
import { Snackbar, Alert } from "@mui/material";

type Props = {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  onClose: () => void;
};

const MessagePopup: React.FC<Props> = ({ open, message, severity = "info", onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MessagePopup;
