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
  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 1400 }}>
      {/* Ensure ONLY the Box is here. No comments or strings outside of it */}
      <Box sx={style}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onClose} variant="text" color="inherit">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained" color={confirmColor}>
            Confirm
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}