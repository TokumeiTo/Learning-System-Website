import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/system";

const float = keyframes`
  0% { transform: translateY(0); opacity: 0.7; }
  50% { transform: translateY(-6px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.7; }
`;

export default function JapaneseTabLoader() {
  return (
    <Box
      sx={{
        py: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Typography
        sx={{
          fontSize: 48,
          fontWeight: 600,
          position: "relative",
          animation: `${float} 1.8s ease-in-out infinite`,
          textShadow: `
            0px 10px 0 rgba(0,0,0,0.12),
            0px 14px 10px rgba(0,0,0,0.15)
          `,
        }}
      >
        学
      </Typography>

      <Typography variant="body2" color="text.secondary">
        読み込み中…
      </Typography>
    </Box>
  );
}
