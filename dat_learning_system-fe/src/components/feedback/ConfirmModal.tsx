import { useState, useEffect } from "react";
import { 
    Dialog, 
    DialogContent, 
    Typography, 
    Button, 
    Stack, 
    Box, 
    alpha, 
    useTheme,
    Zoom
} from "@mui/material";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

interface Props {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmColor?: "error" | "primary" | "warning";
}

export default function ConfirmModal({ 
    open, 
    title, 
    message, 
    onClose, 
    onConfirm, 
    confirmColor = "error" 
}: Props) {
  const theme = useTheme();
  const [canConfirm, setCanConfirm] = useState(false);
  const [countdown, setCountdown] = useState(3);

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
    <Dialog 
      open={open} 
      onClose={onClose} 
      TransitionComponent={Zoom} // Added a smooth zoom entry
      PaperProps={{
        sx: {
          borderRadius: '24px',
          p: 1,
          maxWidth: '400px',
          backgroundImage: 'none' // Ensures clean bgcolor in dark mode
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', p: 4 }}>
        {/* ICON CIRCLE */}
        <Box sx={{ 
          width: 60, 
          height: 60, 
          borderRadius: '50%', 
          bgcolor: alpha(theme.palette[confirmColor].main, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3
        }}>
          <WarningRoundedIcon sx={{ color: theme.palette[confirmColor].main, fontSize: 32 }} />
        </Box>

        <Typography variant="h5" fontWeight={900} gutterBottom sx={{ color: 'text.primary' }}>
          {title}
        </Typography>

        {/* REFINED MESSAGE BOX */}
        <Box sx={{ 
          bgcolor: 'action.hover', 
          p: 2, 
          borderRadius: '16px', 
          mt: 2,
          mb: 4,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            {message}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button 
            onClick={onClose} 
            variant="text" 
            fullWidth
            sx={{ 
                borderRadius: '12px', 
                fontWeight: 700, 
                color: 'text.secondary',
                py: 1.5 
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            variant="contained"
            color={confirmColor}
            disabled={!canConfirm}
            fullWidth
            disableElevation
            sx={{ 
              borderRadius: '12px', 
              fontWeight: 900,
              py: 1.5,
              // Special effect for the disabled countdown state
              '&.Mui-disabled': {
                bgcolor: alpha(theme.palette[confirmColor].main, 0.3),
                color: 'white'
              }
            }}
          >
            {canConfirm ? "Confirm" : `Wait (${countdown}s)`}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}