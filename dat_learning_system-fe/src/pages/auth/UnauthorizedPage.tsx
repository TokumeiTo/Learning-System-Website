import { Box, Button, Card, Stack, Typography } from "@mui/material";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import LoginIcon from "@mui/icons-material/Login";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

type Props = {
  message?: string;
};

export default function UnauthorizedPage({
  message = "You don’t have permission to access this page.",
}: Props) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Card sx={{ p: 5, maxWidth: 420, textAlign: "center", borderRadius: 4 }}>
        <Stack spacing={3} alignItems="center">
          <LockPersonIcon sx={{ fontSize: 80, color: "warning.main" }} />

          <Typography variant="h5" fontWeight={700}>
            Access Denied
          </Typography>

          <Typography color="text.secondary">
            {message}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={() => navigate("/signIn")}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
