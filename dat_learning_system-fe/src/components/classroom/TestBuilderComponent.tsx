import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, IconButton, Checkbox,
  Paper, Typography, Stack, Tooltip, Divider
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AddCircle as AddCircleIcon,
  Add as AddIcon,
  RadioButtonChecked,
  RadioButtonUnchecked,
  Settings
} from '@mui/icons-material';
import type { Test, Question } from '../../types/test';

interface TestBuilderProps {
  initialData?: Test;
  onSave: (test: Test) => void;
}

const TestBuilder: React.FC<TestBuilderProps> = ({ initialData, onSave }) => {
  const [test, setTest] = useState<Test>(initialData || {
    questions: [] as Question[],
    passingGrade: 70,
    title: ''
  });

  // Sync state to parent whenever 'test' changes locally
  useEffect(() => {
    onSave(test);
  }, [test, onSave]);

  // Helper for Top-Level Metadata (Title, Grade)
  const updateMetadata = (updates: Partial<Test>) => {
    setTest(prev => ({ ...prev, ...updates }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      questionText: '',
      points: 10,
      sortOrder: test.questions.length,
      options: [
        { optionText: '', isCorrect: true },
        { optionText: '', isCorrect: false }
      ]
    };
    setTest(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  const removeQuestion = (qIdx: number) => {
    setTest(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== qIdx)
    }));
  };

  const updateQuestion = (qIdx: number, updates: Partial<Question>) => {
    setTest(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[qIdx] = { ...newQuestions[qIdx], ...updates };
      return { ...prev, questions: newQuestions };
    });
  };

  const addOption = (qIdx: number) => {
    const newQuestions = [...test.questions];
    newQuestions[qIdx].options.push({ optionText: '', isCorrect: false });
    setTest({ ...test, questions: newQuestions });
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const newQuestions = [...test.questions];
    if (newQuestions[qIdx].options.length <= 2) return;
    newQuestions[qIdx].options = newQuestions[qIdx].options.filter((_, i) => i !== oIdx);
    setTest({ ...test, questions: newQuestions });
  };

  const toggleCorrectOption = (qIdx: number, oIdx: number) => {
    const newQuestions = [...test.questions];
    newQuestions[qIdx].options = newQuestions[qIdx].options.map((opt, i) => ({
      ...opt,
      isCorrect: i === oIdx 
    }));
    setTest({ ...test, questions: newQuestions });
  };

  return (
    <Box sx={{ mt: 1 }}>
      {/* --- QUIZ METADATA SECTION --- */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Settings sx={{ color: '#818cf8', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ color: '#818cf8', fontWeight: 700 }}>
                QUIZ SETTINGS
            </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Quiz Title"
            value={test.title}
            onChange={(e) => updateMetadata({ title: e.target.value })}
            sx={{ "& .MuiInputBase-input": { color: 'white' }, "& .MuiInputLabel-root": { color: 'gray' } }}
          />
          <TextField
            type="number"
            size="small"
            label="Passing %"
            sx={{ width: 120, "& .MuiInputBase-input": { color: 'white' }, "& .MuiInputLabel-root": { color: 'gray' } }}
            value={test.passingGrade}
            onChange={(e) => updateMetadata({ passingGrade: parseInt(e.target.value) || 0 })}
          />
        </Stack>
      </Paper>

      <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.05)' }} />

      {/* --- QUESTIONS SECTION --- */}
      {test.questions.map((q, qIdx) => (
        <Paper key={qIdx} sx={{ p: 2, mb: 2, bgcolor: '#0f172a', border: '1px solid #334155' }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your question..."
              value={q.questionText}
              onChange={(e) => updateQuestion(qIdx, { questionText: e.target.value })}
              sx={{ "& .MuiInputBase-input": { color: 'white', fontWeight: 600 } }}
            />
            <TextField
              type="number"
              size="small"
              label="Pts"
              sx={{ width: 80, "& .MuiInputBase-input": { color: 'white' }, "& .MuiInputLabel-root": { color: 'gray' } }}
              value={q.points}
              onChange={(e) => updateQuestion(qIdx, { points: parseInt(e.target.value) || 0 })}
            />
            <IconButton color="error" size="small" onClick={() => removeQuestion(qIdx)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack spacing={1} sx={{ ml: 2 }}>
            {q.options.map((opt, oIdx) => (
              <Stack key={oIdx} direction="row" alignItems="center" spacing={1}>
                <Tooltip title={opt.isCorrect ? "Correct Answer" : "Mark as Correct"}>
                  <Checkbox
                    icon={<RadioButtonUnchecked />}
                    checkedIcon={<RadioButtonChecked />}
                    checked={!!opt.isCorrect}
                    onChange={() => toggleCorrectOption(qIdx, oIdx)}
                    sx={{ color: '#6366f1', '&.Mui-checked': { color: '#10b981' } }}
                  />
                </Tooltip>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Option text..."
                  value={opt.optionText}
                  onChange={(e) => {
                    const newOpts = [...q.options];
                    newOpts[oIdx].optionText = e.target.value;
                    updateQuestion(qIdx, { options: newOpts });
                  }}
                  InputProps={{ disableUnderline: true, sx: { color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' } }}
                />
                <IconButton size="small" onClick={() => removeOption(qIdx, oIdx)} sx={{ color: 'rgba(255,255,255,0.2)' }}>
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </Stack>
            ))}
            <Button
              startIcon={<AddIcon />}
              size="small"
              onClick={() => addOption(qIdx)}
              sx={{ alignSelf: 'flex-start', color: '#6366f1', fontSize: '0.75rem' }}
            >
              Add Option
            </Button>
          </Stack>
        </Paper>
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
    </Box>
  );
};

export default TestBuilder;