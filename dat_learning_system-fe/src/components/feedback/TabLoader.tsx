import { Box, CircularProgress, Typography } from "@mui/material";

export default function TabLoader() {
  return (
    <Box
      sx={{
        py: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={28} />
      <Typography color="text.secondary">
        Loading flashcards…
      </Typography>
    </Box>
  );
}
