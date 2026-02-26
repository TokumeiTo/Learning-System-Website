import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, Alert, CircularProgress, Divider } from '@mui/material';
import { Send, Refresh, Quiz, Visibility } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { Test, Option } from '../../types/test';
import { submitLessonQuiz } from '../../api/test.api';

interface Props {
    data: Test;
    onFinish: (score: number, passed: boolean) => void;
    isLocked?: boolean;
    lessonId?: string;
    existingScore?: number | null;
    isCompleted?: boolean;
}

const QuizViewer = ({ data, onFinish, isLocked, lessonId, existingScore, isCompleted }: Props) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(isCompleted || false);
    const [score, setScore] = useState(existingScore || 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);

    const passingThreshold = data.passingGrade || 70;
    const isPassed = score >= passingThreshold;

    useEffect(() => {
        // 1. If we are on a totally different lesson, reset everything
        setAnswers({});
        setShowQuestions(false);

        // 2. Decide what to do with the score and submission state
        if (isCompleted) {
            setSubmitted(true);
            // CRITICAL FIX: 
            // If we already have a score in our local state (like 100%), KEEP IT.
            // Only fallback to 'existingScore' from props if our local state is empty.
            setScore(prev => (prev > 0 ? prev : (existingScore || 0)));
        } else {
            // If the lesson isn't completed, we act normally
            setSubmitted(false);
            setScore(existingScore || 0);
        }

        // Notice: We ONLY watch lessonId. 
        // This prevents the "flash to 0%" when the parent re-renders after completion.
    }, [lessonId]);

    const handleSubmit = async () => {
        if (isLocked || !lessonId || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const result = await submitLessonQuiz({ lessonId, answers });
            const newScore = result.percentage ?? result.Percentage ?? 0;
            const passed = result.isPassed ?? result.IsPassed ?? false;
            setScore(newScore);
            setSubmitted(true);
            onFinish(newScore, passed);
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER 1: COMPLETED SUMMARY ---
    if (submitted && !showQuestions) {
        return (
            <Paper
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                sx={{ bgcolor: '#1e293b', p: 4, borderRadius: 3, border: '1px solid', borderColor: isPassed ? '#10b981' : '#f43f5e', textAlign: 'center' }}
            >
                <Quiz sx={{ fontSize: 60, color: isPassed ? '#10b981' : '#f43f5e', mb: 2 }} />
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>
                    {score}%
                </Typography>
                <Typography variant="h6" sx={{ color: isPassed ? '#10b981' : '#f43f5e', mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {isPassed ? "Test Completed" : "Test Failed"}
                </Typography>

                {!isPassed && (
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, fontSize: '0.9rem' }}>
                        You need {passingThreshold}% to pass. You can review your answers or try again.
                    </Typography>
                )}

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => setShowQuestions(true)}
                        sx={{ color: 'white', borderColor: '#334155' }}
                    >
                        Review Answers
                    </Button>
                    {!isLocked && (
                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={() => {
                                setSubmitted(false);
                                setAnswers({});
                                setScore(0); // Clear the local state so they start fresh
                            }}
                            sx={{ bgcolor: '#6366f1' }}
                        >
                            {isPassed ? "Practice Again?" : "Try Again"}
                        </Button>
                    )}
                </Stack>
            </Paper>
        );
    }

    // --- RENDER 2: ACTIVE QUIZ / REVIEW MODE ---
    return (
        <Paper sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 3, border: '1px solid #334155' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#818cf8', fontWeight: 700 }}>
                    {data.title || 'Knowledge Check'}
                </Typography>
                {submitted && (
                    <Button size="small" onClick={() => setShowQuestions(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Back to Summary
                    </Button>
                )}
            </Stack>

            <Stack spacing={4}>
                {data.questions.map((q, index) => {
                    const questionId = q.id || `q-${index}`;
                    return (
                        <Box key={questionId} sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <Typography sx={{ color: 'white', mb: 2, fontWeight: 500 }}>
                                {index + 1}. {q.questionText}
                            </Typography>

                            <RadioGroup
                                value={answers[questionId] || ''}
                                onChange={(e) => !submitted && setAnswers(prev => ({ ...prev, [questionId]: e.target.value }))}
                            >
                                {q.options.map((opt) => {
                                    const isCorrect = opt.isCorrect;
                                    const isSelected = answers[questionId] === opt.id;
                                    let color = 'rgba(255,255,255,0.7)';
                                    if (submitted) {
                                        if (isCorrect) color = '#10b981';
                                        else if (isSelected) color = '#f43f5e';
                                    }

                                    return (
                                        <FormControlLabel
                                            key={opt.id}
                                            value={opt.id}
                                            disabled={submitted || isLocked}
                                            control={<Radio size="small" sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#818cf8' } }} />}
                                            sx={{ color }}
                                            label={
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="body2">{opt.optionText}</Typography>
                                                    {submitted && isCorrect && (
                                                        <Typography variant="caption" sx={{ color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.1)', px: 0.5, borderRadius: 0.5, fontWeight: 700, fontSize: '0.65rem' }}>
                                                            CORRECT
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            }
                                        />
                                    );
                                })}
                            </RadioGroup>
                        </Box>
                    );
                })}
            </Stack>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                {!submitted ? (
                    <Button
                        variant="contained"
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                        onClick={handleSubmit}
                        disabled={isSubmitting || Object.keys(answers).length < data.questions.length}
                        sx={{ bgcolor: '#6366f1', px: 4, borderRadius: 2 }}
                    >
                        Submit Quiz
                    </Button>
                ) : (
                    <Alert severity={isPassed ? "success" : "error"} sx={{ borderRadius: 2, bgcolor: 'transparent', color: 'white', border: '1px solid' }}>
                        Final Score: {score}% — {isPassed ? "Passed!" : "Try again to unlock progress."}
                    </Alert>
                )}
            </Box>
        </Paper>
    );
};

export default QuizViewer;