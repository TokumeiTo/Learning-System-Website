import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, Stack } from "@mui/material";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmColor?: "error" | "primary" | "warning";
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export default function ConfirmModal({ open, title, message, onClose, onConfirm, confirmColor = "error" }: Props) {
  const [canConfirm, setCanConfirm] = useState(false);
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    let timer: any;

    if (open) {
      setCanConfirm(false);
      setCountdown(2);

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanConfirm(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 1400 }}>
      <Box sx={style}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textIndent: '20px', color: 'orange' }}>
          {message}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
          <Button onClick={onClose} variant="text" color="inherit">
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            variant="contained"
            color={confirmColor}
            disabled={!canConfirm} // Disabled until the 2s timer hits 0
            sx={{ minWidth: 120, fontWeight: 'bold' }}
          >
            {canConfirm ? "Confirm" : `Wait (${countdown}s)`}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}