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

const OptionItem = memo(({ 
  option, oIdx, onUpdate, onRemove, onToggle 
}: { 
  option: Option, oIdx: number, 
  onUpdate: (text: string) => void, 
  onRemove: () => void, 
  onToggle: () => void 
}) => {
  const [localText, setLocalText] = useState(option.optionText);

  useEffect(() => setLocalText(option.optionText), [option.optionText]);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Tooltip title={option.isCorrect ? "Correct Answer" : "Mark as Correct"}>
        <Checkbox
          icon={<RadioButtonUnchecked />}
          checkedIcon={<RadioButtonChecked />}
          checked={!!option.isCorrect}
          onChange={onToggle}
          sx={{ color: '#6366f1', '&.Mui-checked': { color: '#10b981' } }}
        />
      </Tooltip>
      <TextField
        fullWidth variant="standard" placeholder="Option text..."
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        onBlur={() => onUpdate(localText)}
        InputProps={{ disableUnderline: true, sx: { color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' } }}
      />
      <IconButton size="small" onClick={onRemove} sx={{ color: 'rgba(255,255,255,0.2)' }}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </Stack>
  );
});

export default OptionItem;