import { Card, CardActionArea, Box, Typography } from "@mui/material";
import type { Grammar } from "../../mocks/grammar.mock";
import { motion } from "framer-motion";

type Props = {
  grammar: Grammar;
  onClick: () => void;
};

export default function GrammarCard({ grammar, onClick }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{ height: "100%" }}
    >
      <Card elevation={3}>
        <CardActionArea onClick={onClick}>
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">{grammar.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {grammar.meaning}
            </Typography>
          </Box>
        </CardActionArea>
      </Card>
    </motion.div>
  );
}