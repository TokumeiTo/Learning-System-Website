import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Paper, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchPracticeQuizzes, fetchMyAttemptHistory } from '../../api/test.api';
import type { LessonResult, Test } from '../../types_interfaces/test';
import PageLayout from '../../components/layout/PageLayout';

export default function QuizSelectionPage() {
    const { level, category } = useParams<{ level: string; category: string }>();

    const [tests, setTests] = useState<Test[]>([]);
    const [history, setHistory] = useState<LessonResult[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!level || !category) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [testsData, historyData] = await Promise.all([
                    fetchPracticeQuizzes(level, category),
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
    }, [level, category]);

    const handleCardClick = (testId: string, isPassed: boolean) => {
        if (isPassed) {
            navigate(`/quiz/active/${testId}`, { state: { showResultOnly: true } });
        } else {
            navigate(`/quiz/active/${testId}`);
        }
    };



    return (
        <PageLayout>
            <Box sx={{ px: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2, justifyContent:'space-between' }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#f6ad55', textTransform: 'uppercase' }}>
                            {level} {category}
                        </Typography>
                    </Box>
                    <Button onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                        Back to List
                    </Button>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    justifyContent: { xs: 'center' }
                }}>
                    {tests.map((test) => {
                        const attempt = history.find(h => h.testId === test.id);
                        const isPassed = attempt?.isPassed ?? false;
                        console.log(test);

                        return (
                            <Paper
                                key={test.id}
                                onClick={() => handleCardClick(test.id!, isPassed)}
                                elevation={isPassed ? 4 : 0}
                                sx={{
                                    width: { xs: '100%', sm: '300px' }, // Wider to fit the Title
                                    p: 3,
                                    borderRadius: '24px',
                                    bgcolor: isPassed ? '#2ecc71' : '#2d3748',
                                    border: '2px solid',
                                    borderColor: isPassed ? '#27ae60' : '#4a5568',
                                    cursor: 'pointer',
                                    transition: '0.2s ease-in-out',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: isPassed ? '0 10px 20px rgba(46, 204, 113, 0.3)' : '0 10px 20px rgba(0,0,0,0.3)'
                                    }
                                }}
                            >
                                {/* Pass Badge */}
                                {isPassed && (
                                    <Typography variant="caption" sx={{
                                        position: 'absolute', top: 4, right: 10,
                                        bgcolor: 'white', color: '#27ae60', px: 1,
                                        borderRadius: '8px', fontWeight: '900', fontSize: '0.65rem'
                                    }}>
                                        PASSED
                                    </Typography>
                                )}

                                <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, color: isPassed ? 'white' : '#f6ad55', lineHeight: 1.2 }}>
                                    {test.title || "Untitled Quiz"}
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                    <Typography variant="caption" sx={{ color: isPassed ? 'rgba(255,255,255,0.8)' : '#a0aec0', fontWeight: 'bold' }}>
                                        {test.questions.length} Questions
                                    </Typography>
                                    {attempt && (
                                        <Typography variant="body2" sx={{ fontWeight: 900, color: 'white' }}>
                                            Last Progress - {Math.round(attempt.percentage)}%
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>
            </Box>
        </PageLayout>
    );
}