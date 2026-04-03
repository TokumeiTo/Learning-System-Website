import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import type { Test, LessonResult } from "../../types_interfaces/test";
import PageLayout from "../layout/PageLayout";

interface QuizResultSummaryProps {
    test: Test;
    results: LessonResult;
    onRetry: () => void;
    onBackToList: () => void;
}

export default function QuizResultSummary({ test, results, onRetry, onBackToList }: QuizResultSummaryProps) {
    const userAnswers = results.userAnswers || {};
    const correctAnswers = results.correctAnswers || {};

    return (
        <PageLayout>
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, color: 'white' }}>
                {/* SCORE CARD */}
                <Paper sx={{
                    p: 5, mb: 4, borderRadius: 8, textAlign: 'center',
                    bgcolor: results.isPassed ? '#2ecc71' : '#e74c3c', color: 'white'
                }}>
                    <Typography variant="h4" fontWeight="900">
                        {results.isPassed ? "Passed! 合格！" : "Try Again! 不合格"}
                    </Typography>
                    <Typography variant="h1" fontWeight="900">{Math.round(results.percentage)}%</Typography>
                    <Typography>Score: {results.score} / {results.maxScore}</Typography>
                </Paper>

                <Typography variant="h5" fontWeight="bold" mb={2}>Review Answers</Typography>

                <Stack spacing={2} mb={4}>
                    {test.questions.map((q, index) => {
                        const userOptId = userAnswers[q.id!];
                        const correctOptId = correctAnswers[q.id!];
                        const isCorrect = userOptId === correctOptId;

                        const userOptText = q.options.find(o => o.id === userOptId)?.optionText || "Your Answer have been hidden";
                        const correctOptText = q.options.find(o => o.id === correctOptId)?.optionText;

                        return (
                            <Paper key={q.id} sx={{
                                p: 3, bgcolor: '#2d3748', color: 'white',
                                borderLeft: `6px solid ${isCorrect ? '#2ecc71' : '#e74c3c'}`
                            }}>
                                <Typography variant="subtitle2" color="#a0aec0">Question {index + 1}</Typography>
                                <Typography variant="h6" mb={2}>{q.questionText}</Typography>

                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Box>
                                        <Typography variant="caption" display="block" color="#a0aec0">Your Answer</Typography>
                                        <Typography color={isCorrect ? '#2ecc71' : '#ff7675'} fontWeight="bold">{userOptText}</Typography>
                                    </Box>
                                    {!isCorrect && (
                                        <Box>
                                            <Typography variant="caption" display="block" color="#a0aec0">Correct Answer</Typography>
                                            <Typography color="#2ecc71" fontWeight="bold">{correctOptText}</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        );
                    })}
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button variant="outlined" onClick={onBackToList} sx={{ color: 'white', borderColor: '#4a5568' }}>Back to Menu</Button>
                    <Button variant="contained" onClick={onRetry} sx={{ bgcolor: '#34a8fb' }}>Try Again</Button>
                </Stack>
            </Box>
        </PageLayout>
    );
}