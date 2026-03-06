import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import type { Grammar } from "../../types_interfaces/grammar";
import { deleteGrammar } from "../../api/grammar.api";

type Props = {
  open: boolean;
  grammar: Grammar | null;
  onClose: () => void;
  onEdit: (grammar: Grammar) => void;
  onRefresh: () => void;
};

export default function GrammarDetailModal({ open, grammar, onClose, onEdit, onRefresh }: Props) {
  if (!grammar) return null;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${grammar.title}"?`)) {
      try {
        await deleteGrammar(grammar.id);
        onRefresh(); // Reload the list
        onClose();   // Close this modal
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Header with Title and Close Button */}
      <Box sx={{ position: 'relative', pt: 4, pb: 2, px: 3, textAlign: 'center' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>

        {/* The Grammar Title - Styled to look like a focal point */}
        <Typography
          variant="h2"
          sx={{
            color: "error.main",
            fontWeight: 'bold',
            mb: 1,
            fontSize: { xs: '2.5rem', md: '3rem' }
          }}
        >
          {grammar.title}
        </Typography>

        {/* Level Tag (Optional but adds a nice touch) */}
        <Box
          sx={{
            display: 'inline-block',
            px: 2.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor: 'error.light',
            color: 'text.primary',
            fontSize: '0.85rem',
            fontWeight: 'bold'
          }}
        >
          {grammar.jlptLevel}
        </Box>
      </Box>

      <DialogContent sx={{ pb: 3, px: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Meaning & Structure Card Block */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: 2.5,
              bgcolor: 'action.hover',
              borderRadius: 2,
              borderLeft: '5px solid',
              borderColor: 'error.main'
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                Meaning
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.primary', lineHeight: 1.4 }}>
                {grammar.meaning}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                Structure
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  color: 'primary.main',
                  bgcolor: 'background.paper',
                  p: 1,
                  borderRadius: 1,
                  mt: 0.5,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                {grammar.structure}
              </Typography>
            </Box>
          </Box>

          {/* Explanation Section */}
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
              Explanation
            </Typography>
            <Typography
              sx={{
                mt: 1,
                lineHeight: 1.7,
                color: 'text.primary',
                fontSize: '1rem',
                whiteSpace: 'pre-line' // Respects line breaks from the backend
              }}
            >
              {grammar.explanation}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Examples</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {grammar.examples.map((ex, i) => (
            <Box key={i} sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography sx={{ fontSize: '1.1rem' }}>{ex.jp}</Typography>
              <Typography variant="body2" sx={{ color: 'primary.main', my: 0.5 }}>
                {ex.romaji}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ex.en}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <Divider />

      {/* Action Footer using Flexbox */}
      <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          startIcon={<DeleteIcon />}
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>

        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => onEdit(grammar)}
        >
          Edit Grammar
        </Button>
      </DialogActions>
    </Dialog>
  );
}