import { Card, CardActionArea, Typography, Box } from "@mui/material";
import { type Kanji } from "../../types/kanji";
import { motion } from "framer-motion";

type Props = {
  kanji: Kanji;
  onClick: () => void;
};

export default function KanjiCard({ kanji, onClick }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{height: "100%"}}
    >
      <Card elevation={3} sx={{ maxWidth: '200px', minWidth: '200px', height: '100%' }}>
        <CardActionArea onClick={onClick} sx={{height: '100%'}}>
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h3">{kanji.kanji}</Typography>
            <Typography variant="body2" color="text.secondary">
              {kanji.meaning}
            </Typography>
          </Box>
        </CardActionArea>
      </Card>
    </motion.div>

  );
}
