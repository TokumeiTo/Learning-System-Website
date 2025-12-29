import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import type { Grammar } from "../../mocks/grammar.mock";

type Props = {
  open: boolean;
  grammar: Grammar | null;
  onClose: () => void;
};

export default function GrammarDetailModal({ open, grammar, onClose }: Props) {
  if (!grammar) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{color: "red", textAlign: "center", fontSize: 40}}>{grammar.title}</DialogTitle>

      <DialogContent>
        <Typography>
          <strong>Meaning:</strong> {grammar.meaning}
        </Typography>

        <Typography sx={{ mt: 1 }}>
          <strong>Structure:</strong> {grammar.structure}
        </Typography>

        <Typography sx={{ mt: 1, textIndent: '20px' }}>
          {grammar.explanation}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Examples</Typography>
        {grammar.examples.map((ex, i) => (
          <Box key={i} sx={{ mt: 1 }}>
            <Typography>{ex.jp}</Typography>
            <Typography variant="body2">{ex.romaji}</Typography>
            <Typography variant="body2" color="text.secondary">
              {ex.en}
            </Typography>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
}
