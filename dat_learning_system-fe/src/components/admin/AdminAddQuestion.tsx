import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem, Typography, Stack, Autocomplete, CircularProgress, Divider, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import api from "../../hooks/useApi";

export default function AdminAddQuestion({ testId }: { testId: string }) {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<any[]>([]);
    const [selectedSource, setSelectedSource] = useState<any>(null);
    const [status, setStatus] = useState<any>(null);
    const [displayMode, setDisplayMode] = useState(0);
    const [starParts, setStarParts] = useState(['', '', '', '']);

    const handleSearch = async (query: string) => {
        if (query.length < 2) return;
        setLoading(true);
        try {
            const res = await api.get(`/api/JlptQuiz/admin/search-content?query=${query}`);
            setOptions(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleSave = async () => {
        try {
            const payload = {
                sourceId: selectedSource.id,
                displayMode: displayMode,
                points: 10,
                // If it's a star puzzle, we send the parts joined by |
                customPrompt: displayMode === 2 ? starParts.join('|') : null 
            };
            await api.post(`/api/JlptQuiz/admin/link-content/${testId}`, payload);
            setStatus({ type: 'success', msg: "Linked successfully!" });
            setSelectedSource(null);
            setStarParts(['', '', '', '']);
        } catch (err) {
            setStatus({ type: 'error', msg: "Failed to link content." });
        }
    };

    return (
        <Stack spacing={3} sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold">Link Flashcard Content</Typography>
            {status && <Alert severity={status.type}>{status.msg}</Alert>}

            <TextField
                select
                label="Question Type"
                value={displayMode}
                onChange={(e) => setDisplayMode(Number(e.target.value))}
            >
                <MenuItem value={0}>Kanji Reading</MenuItem>
                <MenuItem value={1}>Vocabulary Meaning</MenuItem>
                <MenuItem value={2}>Grammar Star Puzzle</MenuItem>
            </TextField>

            <Autocomplete
                options={options}
                getOptionLabel={(opt) => opt.displayText}
                onInputChange={(_, val) => handleSearch(val)}
                onChange={(_, val) => setSelectedSource(val)}
                loading={loading}
                renderInput={(params) => (
                    <TextField {...params} label="Search Database (Kanji, Vocab, Grammar)..." />
                )}
            />

            {displayMode === 2 && selectedSource && (
                <Stack spacing={2} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="subtitle2">Enter sentence parts in correct order:</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {starParts.map((p, i) => (
                            <TextField 
                                key={i} 
                                label={i === 2 ? "★ Slot" : `Part ${i+1}`}
                                value={p} 
                                onChange={(e) => {
                                    const next = [...starParts];
                                    next[i] = e.target.value;
                                    setStarParts(next);
                                }}
                            />
                        ))}
                    </Box>
                </Stack>
            )}

            <Button 
                variant="contained" 
                startIcon={<SaveIcon />} 
                disabled={!selectedSource} 
                onClick={handleSave}
            >
                Add to Quiz
            </Button>
        </Stack>
    );
}