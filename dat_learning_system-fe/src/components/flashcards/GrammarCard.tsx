import { Card, CardActionArea, Box, Typography } from "@mui/material";
import type { Grammar } from "../../mocks/grammar.mock";

type Props = {
  grammar: Grammar;
  onClick: () => void;
};

export default function GrammarCard({ grammar, onClick }: Props) {
  return (
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
  );
}
