// components/loaders/ActionLoader.tsx
import { Box, Typography, Fade } from "@mui/material";
import { keyframes } from "@mui/system";

const float = keyframes`
  0%, 100% { transform: translateY(0); opacity: 0.8; }
  50% { transform: translateY(-10px); opacity: 1; }
`;

export const ButtonClickLoader = ({ message = "処理中...", kanji = "識" }) => (
  <Fade in timeout={400}>
    <Box
      sx={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(2px)',
        zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        borderRadius: 4
      }}
    >
      <Typography sx={{ 
        fontSize: 48, animation: `${float} 2s ease-in-out infinite`,
        textShadow: '0 10px 15px rgba(0,0,0,0.1)'
      }}>
        {kanji}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, mt: 1, color: 'primary.main' }}>
        {message}
      </Typography>
    </Box>
  </Fade>
);