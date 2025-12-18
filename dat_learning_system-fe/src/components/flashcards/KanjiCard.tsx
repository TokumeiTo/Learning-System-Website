import { Card, CardActionArea, Typography, Box } from "@mui/material";
import { type Kanji } from "../../types/kanji";

type Props = {
  kanji: Kanji;
  onClick: () => void;
};

export default function KanjiCard({ kanji, onClick }: Props) {
  return (
    <Card elevation={3} sx={{maxWidth: '200px', minWidth: '200px'}}>
      <CardActionArea onClick={onClick}>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h3">{kanji.kanji}</Typography>
          <Typography variant="body2" color="text.secondary">
            {kanji.meaning}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
