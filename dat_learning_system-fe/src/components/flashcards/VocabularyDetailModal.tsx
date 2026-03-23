import {
  Box, Typography, Modal, IconButton, Stack,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Vocabulary } from "../../types_interfaces/vocabulary";
import { deleteVocab } from "../../api/vocabulary.api";
import ConfirmModal from "../feedback/ConfirmModal";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  open: boolean;
  vocab: Vocabulary | null;
  onClose: () => void;
  onRefresh: () => void;
  onEdit: (vocab: Vocabulary) => void;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  outline: 'none',
  maxHeight: '90vh',
  overflowY: 'auto'
};

export default function VocabDetailModal({ open, vocab, onClose, onRefresh, onEdit }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for second modal
  const { user } = useAuth();
  const canManageCourses = user?.position === "Admin" || user?.position === "SuperAdmin";
  if (!vocab) return null;

  const handleConfirmDelete = async () => {
    await deleteVocab(vocab.id);
    setShowDeleteConfirm(false);
    onRefresh();
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          {/* Header Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'end', mb: -2 }}>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Main Word Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>
              {vocab.word}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {vocab.reading}
            </Typography>
          </Box>

          {/* The Accent Box (Matches Grammar Style) */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: 'action.hover',
              borderRadius: 2,
              borderLeft: '5px solid',
              borderColor: 'primary.main',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1 }}>
                PART OF SPEECH
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '600' }}>
                {vocab.partOfSpeech}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1 }}>
                MEANING
              </Typography>
              <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                {vocab.meaning}
              </Typography>
            </Box>

            {vocab.explanation && (
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1 }}>
                  EXPLANATION
                </Typography>
                <Typography variant="body2">
                  {vocab.explanation}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Examples Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Example Sentences
            </Typography>

            <Stack spacing={2}>
              {vocab.examples.length > 0 ? (
                vocab.examples.map((ex, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'background.default'
                    }}
                  >
                    <Typography sx={{ fontSize: '1.05rem', mb: 0.5 }}>{ex.japanese}</Typography>
                    <Typography variant="body2" color="text.secondary">{ex.english}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No examples available.
                </Typography>
              )}
            </Stack>
          </Box>
          {canManageCourses && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: '20px' }}>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>

              <Box>
                <Button onClick={onClose}>Close</Button>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => onEdit(vocab)}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete Word?"
        message={`Are you sure you want to delete "${vocab.word}"? This action cannot be undone.`}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}