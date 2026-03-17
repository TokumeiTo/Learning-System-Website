import { Box, Typography, Fade } from "@mui/material";
import { keyframes } from "@mui/system";
import { useEffect, useState } from "react";

/* Floating animation */
const float = keyframes`
  0% { transform: translateY(0); opacity: 0.75; }
  50% { transform: translateY(-8px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.75; }
`;

/* Quotes & tips */
const TIPS = [
  "継続は力なり — Consistency is power",
  "一日一字 — One kanji a day",
  "失敗は学び — Mistakes are learning",
  "千里の道も一歩から — A journey begins with one step",
  "Focus on meaning, not memorization",
];

type Props = {
  fullscreen?: boolean;
  kanji?: string;
};

export default function AppLoader({
  fullscreen = true,
  kanji = "学",
}: Props) {
  // 1. Start with a random index so every load feels different
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));

  useEffect(() => {
    const interval = setInterval(() => {
      // 2. Pick a random index that isn't the current one for the next cycle
      setTipIndex((prevIndex) => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * TIPS.length);
        } while (nextIndex === prevIndex);
        return nextIndex;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        height: fullscreen ? "calc(100vh - 165px)" : "400px",
        mt: fullscreen ? '-100px' : 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {/* Kanji */}
      <Typography
        sx={{
          fontSize: 56,
          fontWeight: 600,
          animation: `${float} 1s ease-in-out infinite`,
          textShadow: `
            0px 12px 0 rgba(0,0,0,0.12),
            0px 18px 12px rgba(0,0,0,0.15)
          `,
        }}
      >
        {kanji}
      </Typography>

      {/* Status */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ letterSpacing: 1 }}
      >
        読み込み中…
      </Typography>

      {/* Tips */}
      <Fade in key={tipIndex} timeout={600}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mt: 1,
            textAlign: "center",
            maxWidth: 260,
            lineHeight: 1.6,
          }}
        >
          {TIPS[tipIndex]}
        </Typography>
      </Fade>
    </Box>
  );
}
