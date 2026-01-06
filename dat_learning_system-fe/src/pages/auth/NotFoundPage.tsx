import { Box, Button, Card, Stack, Typography } from "@mui/material";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
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
          <BrokenImageIcon sx={{ fontSize: 80, color: "text.secondary" }} />

          <Typography variant="h4" fontWeight={700}>
            404
          </Typography>

          <Typography variant="h6">
            Page Not Found
          </Typography>

          <Typography color="text.secondary">
            The page you are looking for doesn’t exist or was moved.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
            >
              Home
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
