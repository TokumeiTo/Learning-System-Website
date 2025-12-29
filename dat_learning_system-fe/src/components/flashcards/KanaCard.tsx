import { Card, CardActionArea, Typography } from "@mui/material";
import type { KanaItem } from "../../types/kana";
import { motion } from "framer-motion";

type KanaCardProps = {
  kana: KanaItem;
  onClick?: () => void;
};

export default function KanaCard({ kana, onClick }: KanaCardProps) {
  const playSound = () => {
    const utterance = new SpeechSynthesisUtterance(kana.romaji);
    utterance.lang = "ja-JP";
    speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{ height: "100%" }}
    >
      <Card
        sx={{
          borderRadius: 2,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: 4,
          },
        }}
      >
        <CardActionArea
          onClick={() => {
            playSound();
            onClick?.();
          }}
          sx={{
            p: 2,
            textAlign: "center",
            height: 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 500 }}>
            {kana.char}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
            {kana.romaji}
          </Typography>
        </CardActionArea>
      </Card>
    </motion.div>
  );
}