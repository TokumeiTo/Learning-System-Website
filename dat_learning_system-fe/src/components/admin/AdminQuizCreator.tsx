import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Stack, Alert } from '@mui/material';
import { createJlptTest } from '../../api/jlpt_quiz.api';

interface AdminQuizCreatorProps {
    initialLevel: string;
    initialCategory: string;
    onSuccess: () => void;
}

export default function AdminQuizCreator({ initialLevel, initialCategory, onSuccess }: AdminQuizCreatorProps) {
    const [title, setTitle] = useState('');
    const [passingGrade, setPassingGrade] = useState(70);

    const handleSave = async () => {
        try {
            await createJlptTest({
                title,
                jlptLevel: initialLevel,
                category: initialCategory,
                passingGrade,
            });
            onSuccess();
        } catch (error) {
            alert("Error saving test");
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" mb={1}>New {initialLevel} {initialCategory} Test</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                This will create a new container in the <b>Tests</b> table.
            </Typography>

            <Stack spacing={3}>
                <TextField 
                    label="Test Title" 
                    fullWidth 
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Weekly Review #1"
                />
                <TextField 
                    label="Passing Grade (%)" 
                    type="number"
                    value={passingGrade}
                    onChange={(e) => setPassingGrade(Number(e.target.value))}
                />
                <Button variant="contained" size="large" onClick={handleSave} disabled={!title}>
                    Save Test Container
                </Button>
            </Stack>
        </Box>
    );
}