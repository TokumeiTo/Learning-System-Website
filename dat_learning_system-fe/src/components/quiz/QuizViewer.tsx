import { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Button, Stack, Alert, CircularProgress } from '@mui/material';
import { Send, Refresh, Quiz, Visibility } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Test } from '../../types_interfaces/test';
import { fetchMyAttemptHistory, submitLessonTest } from '../../api/test.api';
import QuizQuestion from './QuizQuestion';

interface Props {
    data: Test;
    testId: string;
    onFinish: (score: number, passed: boolean) => void;
    isLocked?: boolean;
    lessonId?: string;
    existingScore?: number | null;
    isCompleted?: boolean;
}

const QuizViewer = ({ data, testId, onFinish, isLocked, lessonId, existingScore, isCompleted }: Props) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [correctMapping, setCorrectMapping] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(isCompleted || false);
    const [score, setScore] = useState(existingScore || 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);

    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

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
    }, [lessonId, testId]);

    useEffect(() => {
        const loadAttemptHistory = async () => {
            // Only fetch if the lesson is completed and we have a lessonId
            if (showQuestions && isCompleted && lessonId && Object.keys(answers).length === 0) {
                setIsLoadingHistory(true);
                try {
                    const history = await fetchMyAttemptHistory(lessonId);
                    if (history && history.length > 0) {
                        const latest = history[0];
                        if (latest.correctAnswers) setCorrectMapping(latest.correctAnswers);
                        if (latest.userAnswers) setAnswers(latest.userAnswers);
                    }
                } catch (err) {
                    console.error("Could not load quiz review data:", err);
                } finally {
                    setIsLoadingHistory(false);
                }
            }
        };

        loadAttemptHistory();
    }, [showQuestions, isCompleted, lessonId, answers]);

    const handleSubmit = async () => {
        if (isLocked || !lessonId || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const result = await submitLessonTest({ lessonId: lessonId!, testId: testId, answers });
            if (result.correctAnswers) {
                setCorrectMapping(result.correctAnswers);
            }
            const newPercentage = result.percentage;
            const passed = result.isPassed;
            setScore(newPercentage);
            setSubmitted(true);
            onFinish(newPercentage, passed);
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAnswer = useCallback((questionId: string, value: string) => {
        if (submitted) return;
        setAnswers(prev => {
            if (prev[questionId] === value) return prev;
            return { ...prev, [questionId]: value };
        });
    }, [submitted]);

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
                        You need {passingThreshold}% to pass. Please try again.
                    </Typography>
                )}

                <Stack direction="row" spacing={2} justifyContent="center">
                    {isPassed && (
                        <Button
                            variant="outlined"
                            startIcon={isLoadingHistory ? <CircularProgress size={20} color="inherit" /> : <Visibility />}
                            onClick={() => setShowQuestions(true)}
                            disabled={isLoadingHistory}
                            sx={{ color: 'white', borderColor: '#334155' }}
                        >
                            {isLoadingHistory ? 'Loading Results...' : 'Review Answers'}
                        </Button>
                    )}
                    {!isLocked && (
                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={() => {
                                setSubmitted(false);
                                setShowQuestions(false); // Go back to the main view
                                setAnswers({});          // Clear choices
                                setCorrectMapping({});   // CLEAR the answer key so they can't see the answers
                                setScore(0);
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
        <>
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
                    const qId = q.id || `temp-${index}`;
                    return (
                        <QuizQuestion
                            key={qId}
                            q={q}
                            index={index}
                            currentAnswer={answers[qId] || ''}
                            correctAnswerId={correctMapping[qId]}
                            submitted={submitted}
                            isLocked={isLocked || false}
                            onAnswer={handleAnswer}
                        />
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
                    <Alert severity={isPassed ? "success" : "error"} variant='outlined' sx={{ borderRadius: 2, bgcolor: 'transparent', color: 'white', border: '1px solid' }}>
                        Final Score: {score}% — {isPassed ? "Passed!" : "Try again to unlock progress."}
                    </Alert>
                )}
            </Box>
        </>
    );
};

export default QuizViewer;