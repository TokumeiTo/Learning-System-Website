import { useState } from 'react';
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, Alert } from '@mui/material';
import { Send, Refresh } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { Test, Question, Option } from '../../types/test';
import { submitLessonQuiz } from '../../api/test.api'; // Ensure this matches your API file

interface Props {
    data: Test;
    onFinish: (score: number, passed: boolean) => void;
    isLocked?: boolean;
    lessonId?: string;
}

const QuizViewer = ({ data, onFinish, isLocked, lessonId }: Props) => {
    // 1. answers state now stores QuestionID -> OptionID (GUID strings)
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const passingThreshold = data.passingGrade || 70;

    const handleOptionChange = (questionId: string, optionId: string) => {
        if (submitted || isLocked) return;
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        if (isLocked || !lessonId) return;

        // Transform Record<string, string> into { questionId, selectedOptionText }[]
        const formattedAnswers = Object.entries(answers).map(([qId, optId]) => ({
            questionId: qId,
            selectedOptionText: optId // Even though it's named 'Text', we are passing the ID
        }));

        const submission = {
            lessonId: lessonId,
            answers: formattedAnswers
        };

        try {
            const result = await submitLessonQuiz(submission);

            setScore(result.percentage);
            setSubmitted(true);
            onFinish(result.percentage, result.isPassed);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit quiz.");
        }
    };

    if (!data.questions || data.questions.length === 0) return null;

    return (
        <Paper sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 3, border: '1px solid #334155' }}>
            <Typography variant="h6" sx={{ color: '#818cf8', mb: 3, fontWeight: 700 }}>
                {data.title || 'Knowledge Check'}
            </Typography>

            <Stack spacing={4}>
                {data.questions.map((q, index) => {
                    const questionId = q.id || `q-${index}`;
                    return (
                        <Box key={questionId} sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ color: 'white', mb: 2, fontWeight: 500 }}>
                                    {index + 1}. {q.questionText}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                                    {q.points} pts
                                </Typography>
                            </Stack>

                            <RadioGroup
                                value={answers[questionId] || ''}
                                onChange={(e) => handleOptionChange(questionId, e.target.value)}
                            >
                                {q.options.map((opt: Option) => {
                                    // 3. UI logic: We only highlight green/red if the backend 
                                    // returned the 'isCorrect' flag (which it only does for Admins)
                                    const isCorrect = opt.isCorrect;
                                    const isSelected = answers[questionId] === opt.id;

                                    let labelColor = 'rgba(255,255,255,0.7)';
                                    if (submitted || isLocked) {
                                        if (isCorrect === true) labelColor = '#10b981';
                                        else if (isSelected && isCorrect === false) labelColor = '#f43f5e';
                                    }

                                    return (
                                        <FormControlLabel
                                            key={opt.id}
                                            value={opt.id} // STORE THE ID, NOT THE TEXT
                                            control={<Radio size="small" sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#818cf8' } }} />}
                                            label={opt.optionText} // SHOW THE TEXT
                                            disabled={submitted || isLocked}
                                            sx={{
                                                color: labelColor,
                                                '& .MuiTypography-root': { transition: 'color 0.2s' }
                                            }}
                                        />
                                    );
                                })}
                            </RadioGroup>
                        </Box>
                    );
                })}
            </Stack>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <AnimatePresence mode="wait">
                    {!submitted && !isLocked ? (
                        <Button
                            variant="contained"
                            startIcon={<Send />}
                            onClick={handleSubmit}
                            disabled={Object.keys(answers).length < data.questions.length}
                            sx={{ bgcolor: '#6366f1', px: 4, borderRadius: 2, '&:hover': { bgcolor: '#4f46e5' } }}
                        >
                            Submit Quiz
                        </Button>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Alert
                                severity={score >= passingThreshold ? "success" : "error"}
                                sx={{ borderRadius: 2, bgcolor: score >= passingThreshold ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', color: 'white', border: '1px solid' }}
                            >
                                <Typography fontWeight={700}>
                                    Score: {score}% — {score >= passingThreshold ? "Passed!" : "Try again to unlock the next lesson."}
                                </Typography>
                            </Alert>

                            {score < passingThreshold && !isLocked && (
                                <Button
                                    startIcon={<Refresh />}
                                    sx={{ mt: 2, color: '#818cf8', fontWeight: 600 }}
                                    onClick={() => { setSubmitted(false); setAnswers({}); }}
                                >
                                    Retake Quiz
                                </Button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>
        </Paper>
    );
};

export default QuizViewer;