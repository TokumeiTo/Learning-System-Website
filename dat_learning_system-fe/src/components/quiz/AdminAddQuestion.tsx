import React, { useState } from 'react';
import { 
    Box, TextField, Button, MenuItem, Typography, 
    Stack, Divider, Paper, Alert 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import api from "../../hooks/useApi";

interface AdminAddQuestionProps {
    testId: string;
}

export default function AdminAddQuestion({ testId }: AdminAddQuestionProps) {
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [form, setForm] = useState({
        displayMode: 0, 
        prompt: '',
        correctAnswer: '',
        explanation: '',
        points: 10,
        options: ['', '', '', '']
    });

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...form.options];
        newOptions[index] = value;
        setForm({ ...form, options: newOptions });
    };

    const handleSave = async () => {
        try {
            await api.post(`/api/JlptQuiz/admin/add-question/${testId}`, form);
            setStatus({ type: 'success', msg: "Question saved successfully!" });
            setForm({ ...form, prompt: '', correctAnswer: '', options: ['', '', '', ''] });
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            setStatus({ type: 'error', msg: "Failed to save question." });
        }
    };

    return (
        <Box>
            <Typography variant="h6" fontWeight="bold" color="secondary" gutterBottom>
                Add Question Content
            </Typography>

            {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.msg}</Alert>}

            <Stack spacing={3}>
                {/* Header Info: Type and Points */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        select
                        sx={{ flex: 2, minWidth: '200px' }}
                        label="Question Type"
                        value={form.displayMode}
                        onChange={(e) => setForm({ ...form, displayMode: Number(e.target.value) })}
                    >
                        <MenuItem value={0}>Kanji Reading (漢字読み)</MenuItem>
                        <MenuItem value={1}>Vocabulary Meaning (意味)</MenuItem>
                        <MenuItem value={2}>Grammar Star Puzzle (並べ替え)</MenuItem>
                    </TextField>
                    <TextField 
                        label="Points" 
                        type="number" 
                        sx={{ flex: 1, minWidth: '100px' }} 
                        value={form.points}
                        onChange={(e) => setForm({...form, points: Number(e.target.value)})}
                    />
                </Box>

                <TextField
                    label={form.displayMode === 2 ? "Sentence (use __ for blanks)" : "Question Prompt"}
                    fullWidth
                    multiline
                    rows={2}
                    value={form.prompt}
                    onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                />

                <Divider textAlign="left"><Typography variant="caption" color="text.secondary">OPTIONS</Typography></Divider>

                {/* Options Layout using Flexbox */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {form.options.map((opt, idx) => (
                        <TextField
                            key={idx}
                            label={`Option ${idx + 1}`}
                            sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '200px' }}
                            size="small"
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                        />
                    ))}
                </Box>

                <TextField
                    label="Correct Answer"
                    fullWidth
                    required
                    value={form.correctAnswer}
                    onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                    helperText="Must match one of the options above exactly."
                />

                <TextField
                    label="Explanation (Optional)"
                    fullWidth
                    multiline
                    rows={2}
                    value={form.explanation}
                    onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                />

                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={!form.prompt || !form.correctAnswer}
                    sx={{ alignSelf: 'flex-end', px: 4 }}
                >
                    Save to Test
                </Button>
            </Stack>
        </Box>
    );
}