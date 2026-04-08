import { Box, Typography, Button, Paper, Stack, IconButton, useTheme } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import type { Test, LessonResult } from "../../types_interfaces/test";
import PageLayout from "../layout/PageLayout";

interface QuizResultSummaryProps {
    test: Test;
    results: LessonResult;
    onRetry: () => void;
    onBackToList: () => void;
}

export default function QuizResultSummary({ test, results, onRetry, onBackToList }: QuizResultSummaryProps) {
    const theme = useTheme();
    const userAnswers = results.userAnswers || {};
    const correctAnswers = results.correctAnswers || {};

    return (
        <PageLayout>
            <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>

                {/* HEADER WITH CONSISTENT BACK NAVIGATION */}
                <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                    <IconButton
                        onClick={onBackToList}
                        sx={{
                            color: 'text.primary',
                            bgcolor: 'action.hover',
                            borderRadius: '12px',
                            p: 1.2,
                            transition: '0.2s',
                            '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                transform: 'translateX(-4px)'
                            }
                        }}
                    >
                        <ArrowBackIosNewIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                    <Box>
                        <Typography variant="overline" color="primary" fontWeight="bold" sx={{ lineHeight: 1 }}>
                            Quiz Completed
                        </Typography>
                        <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                            Review Answers
                        </Typography>
                    </Box>
                </Stack>

                {/* VISUAL SCORECARD */}
                <Paper elevation={0} sx={{
                    p: 4, mb: 6, borderRadius: '24px', textAlign: 'center',
                    bgcolor: results.isPassed ? 'success.main' : 'error.main',
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="h5" fontWeight="800" sx={{ opacity: 0.9, mb: 1 }}>
                        {results.isPassed ? "CONGRATULATIONS! 合格" : "KEEP PRACTICING! 不合格"}
                    </Typography>
                    <Typography variant="h1" fontWeight="900" sx={{ my: 1, fontSize: { xs: '4rem', md: '6rem' } }}>
                        {Math.round(results.percentage)}%
                    </Typography>
                    <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 2 }}>
                        <Box>
                            <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>SCORE</Typography>
                            <Typography variant="h6" fontWeight="bold">{results.score} / {results.maxScore}</Typography>
                        </Box>
                        <Box sx={{ width: '1px', bgcolor: 'rgba(255,255,255,0.3)' }} />
                        <Box>
                            <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>STATUS</Typography>
                            <Typography variant="h6" fontWeight="bold">{results.isPassed ? "PASSED" : "FAILED"}</Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* ANSWERS LIST */}
                <Typography variant="h6" fontWeight="bold" mb={3} color="text.primary">
                    Detailed Report
                </Typography>

                <Stack spacing={3} mb={6}>
                    {test.questions.map((q, index) => {
                        const userOptId = userAnswers[q.id!];
                        const correctOptId = correctAnswers[q.id!];
                        const isCorrect = userOptId === correctOptId;

                        const userOptText = q.options.find(o => o.id === userOptId)?.optionText || "Hidden";
                        const correctOptText = q.options.find(o => o.id === correctOptId)?.optionText;

                        return (
                            <Paper key={q.id} sx={{
                                p: 3, borderRadius: '20px',
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Indicator Stripe */}
                                <Box sx={{
                                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px',
                                    bgcolor: isCorrect ? 'success.main' : 'error.main'
                                }} />

                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                            QUESTION {index + 1}
                                        </Typography>
                                        <Typography variant="h6" mt={1} mb={2} fontWeight={700} sx={{ lineHeight: 1.4 }}>
                                            {q.questionText}
                                        </Typography>
                                    </Box>
                                    {isCorrect ?
                                        <CheckCircleOutlineIcon color="success" /> :
                                        <HighlightOffIcon color="error" />
                                    }
                                </Stack>

                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                    gap: 2,
                                    mt: 1,
                                    p: 2,
                                    borderRadius: '12px',
                                    bgcolor: 'action.hover'
                                }}>
                                    <Box>
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                            YOUR ANSWER
                                        </Typography>
                                        <Typography color={isCorrect ? 'success.main' : 'error.main'} fontWeight="800">
                                            {userOptText}
                                        </Typography>
                                    </Box>
                                    {!isCorrect && (
                                        <Box>
                                            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                                CORRECT ANSWER
                                            </Typography>
                                            <Typography color="success.main" fontWeight="800">
                                                {correctOptText}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        );
                    })}
                </Stack>

                {/* BOTTOM ACTIONS */}
                <Stack direction="row" spacing={2} justifyContent="center" pb={8}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={onBackToList}
                        sx={{ borderRadius: '16px', py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Back to List
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<ReplayIcon />}
                        onClick={onRetry}
                        sx={{ borderRadius: '16px', py: 1.5, textTransform: 'none', fontWeight: 'bold', boxShadow: theme.shadows[4] }}
                    >
                        Try Again
                    </Button>
                </Stack>
            </Box>
        </PageLayout>
    );
}