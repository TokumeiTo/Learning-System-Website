import React, { useState, memo } from 'react';
import { Box, Button, TextField, Paper, Typography, Stack, IconButton, Divider } from '@mui/material';
import { Delete as DeleteIcon, AddCircle as AddCircleIcon, Add as AddIcon, Settings } from '@mui/icons-material';
import type { Test, Question } from '../../types_interfaces/test';
import MessagePopup from '../feedback/MessagePopup';

interface TestBuilderProps {
  initialData?: Test;
  onSave: (test: Test) => void;
}

// --- OPTION ITEM (Memoized) ---
const FastOption = memo(({
  initialText,
  isCorrect,
  onTextChange,
  onToggle,
  onRemove,
  radioName
}: {
  initialText: string,
  isCorrect: boolean,
  onTextChange: (val: string) => void,
  onToggle: () => void,
  onRemove: () => void,
  radioName: string
}) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <input
        type="radio"
        name={radioName}
        defaultChecked={isCorrect}
        onChange={onToggle}
        style={{ cursor: 'pointer' }}
      />
      <TextField
        fullWidth
        variant="standard"
        placeholder="Option text..."
        defaultValue={initialText}
        // KEY: No state update on change, just mutating the object reference
        onChange={(e) => onTextChange(e.target.value)}
        InputProps={{ disableUnderline: true, sx: { color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' } }}
      />
      <IconButton size="small" onClick={onRemove} sx={{ color: 'rgba(255,255,255,0.2)' }}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </Stack>
  );
});

// --- QUESTION ITEM ---
const FastQuestion = memo(({
  question,
  index,
  onRemove
}: {
  question: Question,
  index: number,
  onRemove: () => void
}) => {
  // We only use state for the "structure" of options (the count), not the text.
  const [, setTick] = useState(0);
  const forceUpdate = () => setTick(t => t + 1);

  const addOption = () => {
    question.options.push({ optionText: '', isCorrect: false });
    forceUpdate(); // Only re-render when the count changes
  };

  const removeOption = (oIdx: number) => {
    if (question.options.length <= 2) return;
    question.options.splice(oIdx, 1);
    forceUpdate();
  };

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: '#0f172a', border: '1px solid #334155' }}>
      <Stack direction="row" spacing={2} mb={2}>
        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 900 }}>#{index + 1}</Typography>
        <TextField
          fullWidth
          size="small"
          defaultValue={question.questionText}
          onChange={(e) => { question.questionText = e.target.value }}
          sx={{ "& .MuiInputBase-input": { color: 'white' } }}
        />
        <TextField
          label="Pts"
          type="number"
          size="small"
          defaultValue={question.points || 10}
          inputProps={{ min: 1, max: 50 }}
          onChange={(e) => {
            let val = parseInt(e.target.value);
            if (val > 50) val = 50;
            if (val < 1) val = 1;
            question.points = val;
          }}
          sx={{
            width: '100px',
            "& .MuiInputBase-input": { color: '#818cf8', fontWeight: 700, textAlign: 'center' },
            "& .MuiInputLabel-root": { color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }
          }}
        />
        <IconButton color="error" onClick={onRemove}><DeleteIcon /></IconButton>
      </Stack>

      <Stack spacing={1} ml={4}>
        {question.options.map((opt, oIdx) => (
          <FastOption
            key={`${index}-${oIdx}-${question.options.length}`} // Key helps React track the list
            radioName={`correct-${index}`}
            initialText={opt.optionText}
            isCorrect={!!opt.isCorrect}
            onTextChange={(val) => { opt.optionText = val }}
            onToggle={() => {
              question.options.forEach((o, i) => o.isCorrect = i === oIdx);
            }}
            onRemove={() => removeOption(oIdx)}
          />
        ))}
        <Button
          startIcon={<AddIcon />}
          size="small"
          onClick={addOption}
          sx={{ alignSelf: 'flex-start', mt: 1, color: '#6366f1' }}
        >
          Add Option
        </Button>
      </Stack>
    </Paper>
  );
});

// --- MAIN BUILDER ---
const TestBuilder: React.FC<TestBuilderProps> = ({ initialData, onSave }) => {
  // 1. Structural/Metadata State
  const [questions, setQuestions] = useState<Question[]>(initialData?.questions || []);
  const [title, setTitle] = useState(initialData?.title || '');
  const [passingGrade, setPassingGrade] = useState(initialData?.passingGrade || 70);
  const [popup, setPopup] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "info" | "warning"
  });
  const [isSaved, setIsSaved] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, {
      questionText: '',
      points: 10,
      type: 'MultipleChoice',
      sortOrder: questions.length,
      options: [
        { optionText: '', isCorrect: true },
        { optionText: '', isCorrect: false }
      ]
    }]);
  };

  const handleClosePopup = () => setPopup(prev => ({ ...prev, open: false }));

  // 2. The Final Collector
  const handleSave = async () => {
    try {

      await onSave({
        title,
        passingGrade,
        isGlobal: false,
        questions: questions
      });

      setIsSaved(true);

      setPopup({
        open: true,
        message: "Quiz saved successfully!",
        severity: "success"
      });

    } catch (err: any) {

      // Check if it's a 401 (Session Expired) - handled by our Interceptor
      // Otherwise, show the error here
      setPopup({
        open: true,
        message: err.response?.data?.message || "Failed to sync data with server.",
        severity: "error"
      });
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      {/* --- RE-ADDED METADATA SECTION --- */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <Settings sx={{ color: '#818cf8', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ color: '#818cf8', fontWeight: 700 }}>
            TEST SETTINGS
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Test Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ "& .MuiInputBase-input": { color: 'white' }, "& .MuiInputLabel-root": { color: 'gray' } }}
          />
          <TextField
            type="number"
            size="small"
            label="Pass %"
            sx={{ width: 120, "& .MuiInputBase-input": { color: 'white' }, "& .MuiInputLabel-root": { color: 'gray' } }}
            value={passingGrade}
            onChange={(e) => setPassingGrade(parseInt(e.target.value) || 0)}
          />
          <Button
            variant="contained"
            onClick={handleSave}
            // Disable if currently busy or already finished
            sx={{
              bgcolor: isSaved ? '#10b981' : '#6366f1',
              fontWeight: 800,
              px: 4,
            }}
          >
            Save
          </Button>
        </Stack>
      </Paper>

      <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.05)' }} />

      {/* --- FAST QUESTIONS --- */}
      {questions.map((q, idx) => (
        <FastQuestion
          key={idx}
          index={idx}
          question={q}
          onRemove={() => setQuestions(questions.filter((_, i) => i !== idx))}
        />
      ))}

      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddCircleIcon />}
        onClick={addQuestion}
        sx={{
          py: 1.5,
          borderStyle: 'dashed',
          color: 'white',
          borderColor: 'rgba(255,255,255,0.2)',
          '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(99,102,241,0.05)' }
        }}
      >
        Add Question
      </Button>
      {/* The Popup Component */}
      <MessagePopup
        open={popup.open}
        message={popup.message}
        severity={popup.severity}
        onClose={handleClosePopup}
      />
    </Box>
  );
};

export default TestBuilder;