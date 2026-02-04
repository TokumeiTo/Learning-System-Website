import React from 'react';
import { Paper, Stack, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { History as HistoryIcon, DeleteSweepOutlined } from '@mui/icons-material';

interface Props {
  history: string[];
  onHistoryClick: (word: string) => void;
  onClearHistory: () => void; // New Prop
}

const DictionarySidebar: React.FC<Props> = ({ history, onHistoryClick, onClearHistory }) => (
  <Stack spacing={3}>
    <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid #eef2f6', boxShadow: 'none' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <HistoryIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={800}>Search History</Typography>
        </Stack>
        
        {history.length > 0 && (
          <Tooltip title="Clear all history">
            <IconButton size="small" onClick={onClearHistory} sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
              <DeleteSweepOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Stack spacing={0.5}>
        {history.length === 0 ? (
          <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
            No history yet
          </Typography>
        ) : (
          history.map((word) => (
            <Button
              key={word}
              fullWidth
              onClick={() => onHistoryClick(word)}
              sx={{ 
                justifyContent: 'start', 
                borderRadius: 2, 
                color: 'text.secondary', 
                textTransform: 'none',
                px: 2,
                '&:hover': { bgcolor: 'primary.light', color: 'primary.main' }
              }}
            >
              {word}
            </Button>
          ))
        )}
      </Stack>
    </Paper>

    {/* IT Glossary Card remains the same */}
    <Paper sx={{ p: 3, borderRadius: 5, bgcolor: '#1e293b', color: 'white' }}>
      <Typography variant="subtitle1" fontWeight={800} gutterBottom>IT Glossary</Typography>
      <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
        Find specific translations for technical IT terminology.
      </Typography>
      <Button fullWidth variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
        Open IT Glossary
      </Button>
    </Paper>
  </Stack>
);

export default DictionarySidebar;