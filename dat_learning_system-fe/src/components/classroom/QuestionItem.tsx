import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Box, Button, TextField, IconButton, Checkbox,
  Paper, Typography, Stack, Tooltip, Divider
} from '@mui/material';
import {
  Delete as DeleteIcon, AddCircle as AddCircleIcon,
  Add as AddIcon, RadioButtonChecked, RadioButtonUnchecked, Settings
} from '@mui/icons-material';
import type { Test, Question, Option } from '../../types/test';
import OptionItem from './OptionItem';


const QuestionItem = memo(({ 
  question, qIdx, onUpdate, onRemove 
}: { 
  question: Question, qIdx: number, 
  onUpdate: (updates: Partial<Question>) => void, 
  onRemove: () => void 
}) => {
  const [localText, setLocalText] = useState(question.questionText);

  useEffect(() => setLocalText(question.questionText), [question.questionText]);

  const handleOptionUpdate = (oIdx: number, text: string) => {
    const newOpts = [...question.options];
    newOpts[oIdx] = { ...newOpts[oIdx], optionText: text };
    onUpdate({ options: newOpts });
  };

  const toggleCorrect = (oIdx: number) => {
    const newOpts = question.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === oIdx 
    }));
    onUpdate({ options: newOpts });
  };

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: '#0f172a', border: '1px solid #334155' }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          fullWidth size="small" placeholder="Type your question..."
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={() => onUpdate({ questionText: localText })}
          sx={{ "& .MuiInputBase-input": { color: 'white', fontWeight: 600 } }}
        />
        <TextField
          type="number" size="small" label="Pts"
          sx={{ width: 80, "& .MuiInputBase-input": { color: 'white' } }}
          value={question.points}
          onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 0 })}
        />
        <IconButton color="error" size="small" onClick={onRemove}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Stack spacing={1} sx={{ ml: 2 }}>
        {question.options.map((opt, oIdx) => (
          <OptionItem
            key={oIdx}
            option={opt}
            oIdx={oIdx}
            onUpdate={(text) => handleOptionUpdate(oIdx, text)}
            onToggle={() => toggleCorrect(oIdx)}
            onRemove={() => {
                if (question.options.length <= 2) return;
                onUpdate({ options: question.options.filter((_, i) => i !== oIdx) });
            }}
          />
        ))}
        <Button
          startIcon={<AddIcon />} size="small"
          onClick={() => onUpdate({ options: [...question.options, { optionText: '', isCorrect: false }] })}
          sx={{ alignSelf: 'flex-start', color: '#6366f1', fontSize: '0.75rem' }}
        >
          Add Option
        </Button>
      </Stack>
    </Paper>
  );
});

export default QuestionItem;
