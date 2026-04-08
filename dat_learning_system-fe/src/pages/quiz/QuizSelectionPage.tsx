import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Button,
    Skeleton, Stack, Chip, useTheme,
    IconButton,
    alpha
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { fetchPracticeQuizzes, fetchMyAttemptHistory } from '../../api/test.api';
import type { LessonResult, Test } from '../../types_interfaces/test';
import PageLayout from '../../components/layout/PageLayout';

export default function QuizSelectionPage() {
    const { level, category } = useParams<{ level: string; category: string }>();
    const theme = useTheme();
    const navigate = useNavigate();

    const [tests, setTests] = useState<Test[]>([]);
    const [history, setHistory] = useState<LessonResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm] = useState(""); // Placeholder for future search functionality

    useEffect(() => {
        if (!level || !category) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [testsData, historyData] = await Promise.all([
                    // Now correctly passing searchTerm to the API
                    fetchPracticeQuizzes(level, category, searchTerm),
                    fetchMyAttemptHistory(undefined, undefined, level)
                ]);
                setTests(testsData);
                setHistory(historyData);
            } catch (err) {
                console.error("Failed to load selection data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [level, category, searchTerm]); // Added searchTerm to dependencies

    const handleCardClick = (testId: string, isPassed: boolean) => {
        navigate(`/quiz/active/${testId}`, {
            state: { showResultOnly: isPassed }
        });
    };

    return (
        <PageLayout>
            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
                {/* Header Section */}
                <Stack direction="row" alignItems="center" spacing={2} mb={6}>
                    {/* Clean, high-visibility Back Button */}
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            color: 'text.primary',
                            bgcolor: 'action.hover', // Subtle background so it's not "invisible"
                            borderRadius: '12px',
                            p: 1.5,
                            transition: '0.2s',
                            '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                transform: 'translateX(-4px)' // Physical feedback on hover
                            }
                        }}
                    >
                        <ArrowBackIosNewIcon sx={{ fontSize: 32 }} />
                    </IconButton>

                    <Box>
                        <Typography
                            variant="overline"
                            color="primary"
                            fontWeight="bold"
                            sx={{ letterSpacing: 2, lineHeight: 1 }}
                        >
                            {level} Level
                        </Typography>
                        <Typography
                            variant="h3"
                            fontWeight={900}
                            sx={{
                                textTransform: 'capitalize',
                                lineHeight: 1.2,
                                fontSize: { xs: '2rem', md: '3rem' } // Responsive font sizing
                            }}
                        >
                            {category} Quizzes
                        </Typography>
                    </Box>
                </Stack>

                {/* Content Container (Flex Version) */}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                }}>
                    {loading ? (
                        Array.from(new Array(6)).map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="rectangular"
                                width={320}
                                height={160}
                                sx={{ borderRadius: '24px', flexGrow: { xs: 1, sm: 0 } }}
                            />
                        ))
                    ) : (
                        tests.map((test) => {
                            const attempt = history.find(h => h.testId === test.id);
                            const isPassed = attempt?.isPassed ?? false;

                            return (
                                <Paper
                                    key={test.id}
                                    onClick={() => handleCardClick(test.id!, isPassed)}
                                    sx={{
                                        p: 3,
                                        width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.33% - 24px)' },
                                        minWidth: { sm: '300px' },
                                        borderRadius: '24px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        border: '2px solid',
                                        borderColor: isPassed ? 'success.main' : 'divider',
                                        bgcolor: isPassed
                                            ? (theme.palette.mode === 'dark' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(46, 204, 113, 0.05)')
                                            : 'background.paper',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            borderColor: 'primary.main',
                                            boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                                            '& .arrow-icon': { opacity: 1, transform: 'translateX(0)' }
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'absolute', bottom: 20, right: 16 }}>
                                        {isPassed ? (
                                            <Chip
                                                icon={<CheckCircleIcon style={{ color: 'inherit' }} />}
                                                label="PASSED"
                                                size="small"
                                                color="success"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        ) : (
                                            <Chip
                                                icon={<PlayArrowIcon />}
                                                label="START"
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        )}
                                    </Box>

                                    <Stack spacing={3}>
                                        <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                                            {test.title || "Untitled Quiz"}
                                        </Typography>

                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body2" color="text.secondary">
                                                {test.questions.length} Questions
                                            </Typography>
                                            {attempt && (
                                                <>
                                                    <Typography variant="body2" color="text.secondary">•</Typography>
                                                    <Typography variant="body2" fontWeight="bold" color={isPassed ? "success.main" : "primary"}>
                                                        {Math.round(attempt.percentage)}%
                                                    </Typography>
                                                </>
                                            )}
                                        </Stack>
                                    </Stack>
                                </Paper>
                            )
                        })
                    )}
                </Box>
            </Box>
        </PageLayout>
    );
}