import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Typography, Button, Stack, LinearProgress,
    Paper, useTheme, useMediaQuery,
    IconButton,
    alpha
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { fetchQuizById, submitLessonTest, fetchMyAttemptHistory } from '../../api/test.api';
import QuizResultSummary from '../../components/quiz/QuizResultSummary';
import type { Test, LessonResult } from '../../types_interfaces/test';
import getFullImageUrl from '../../utils/getFullImageUrl';
import PageLayout from '../../components/layout/PageLayout';

const OptionButton = React.memo(({ id, text, isSelected, onClick }: {
    id: string,
    text: string,
    isSelected: boolean,
    onClick: (id: string) => void
}) => {
    const isImage = text.startsWith('/uploads') || text.startsWith('http');
    const theme = useTheme();

    return (
        <Paper
            elevation={isSelected ? 4 : 1}
            onClick={() => onClick(id)}
            sx={{
                p: isImage ? 1 : 3,
                width: '100%',
                minHeight: '100px',
                borderRadius: '20px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '2px solid',
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected
                    ? (theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light')
                    : 'background.paper',
                color: isSelected ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: 'primary.main',
                    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                    '& .arrow-icon': { opacity: 1, transform: 'translateX(0)' }
                },
                '&:active': { transform: 'scale(0.98)' }
            }}
        >
            {isSelected && (
                <CheckCircleIcon
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        fontSize: 20,
                        color: 'inherit'
                    }}
                />
            )}

            {isImage ? (
                <img
                    src={getFullImageUrl(text)}
                    alt="Option"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '160px',
                        objectFit: 'contain',
                        borderRadius: '12px'
                    }}
                />
            ) : (
                <Typography variant="body1" sx={{ fontWeight: 600, textAlign: 'center' }}>
                    {text}
                </Typography>
            )}
        </Paper>
    );
});

export default function QuizActivePage() {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [test, setTest] = useState<Test | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [results, setResults] = useState<LessonResult | null>(null);

    useEffect(() => {
        if (!testId) return;
        const initPage = async () => {
            try {
                const data = await fetchQuizById(testId);
                setTest(data);
                if (location.state?.showResultOnly) {
                    const historyData = await fetchMyAttemptHistory(undefined, testId);
                    if (historyData?.length > 0) setResults(historyData[0]);
                }
            } catch (error) {
                navigate('/quiz');
            }
        };
        initPage();
    }, [testId, navigate, location.state]);

    const handleSelect = useCallback((optionId: string) => {
        if (!test) return;
        const questionId = test.questions[currentIndex]?.id;
        if (questionId) setUserAnswers(prev => ({ ...prev, [questionId]: optionId }));
    }, [test, currentIndex]);

    const handleSubmit = async () => {
        if (!testId) return;
        try {
            const res = await submitLessonTest({ testId, answers: userAnswers });
            setResults(res);
        } catch (error) {
            console.error("Submission failed", error);
        }
    };

    const q = test?.questions[currentIndex];

    const renderedOptions = useMemo(() => {
        if (!q) return null;
        return q.options.map((opt) => (
            <OptionButton
                key={opt.id}
                id={opt.id!}
                text={opt.optionText}
                isSelected={userAnswers[q.id!] === opt.id}
                onClick={handleSelect}
            />
        ));
    }, [q, userAnswers, handleSelect]);

    if (results && test) {
        return <QuizResultSummary
            test={test}
            results={results}
            onRetry={() => { setResults(null); setCurrentIndex(0); setUserAnswers({}); }}
            onBackToList={() => navigate(-1)}
        />;
    }

    if (!test || !q) {
        return (
            <PageLayout>
                <Box sx={{ width: '100%', mt: 10, px: 3, textAlign: 'center' }}>
                    <LinearProgress sx={{ borderRadius: 5, height: 8 }} />
                    <Typography sx={{ mt: 2, color: 'text.secondary' }}>Preparing your quiz...</Typography>
                </Box>
            </PageLayout>
        );
    }

    const progress = ((currentIndex + 1) / test.questions.length) * 100;

    return (
        <PageLayout>
            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
                {/* Header */}
                <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                    {/* Consistent high-visibility Back Button */}
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            color: 'text.primary',
                            bgcolor: 'action.hover',
                            borderRadius: '12px',
                            p: 1.2, // Slightly more compact for the H4 version
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
                        <Typography
                            variant="overline"
                            color="primary"
                            fontWeight="bold"
                            sx={{ letterSpacing: 1.5, lineHeight: 1 }}
                        >
                            {test.category}
                        </Typography>
                        <Typography
                            variant="h4"
                            fontWeight={800}
                            color="text.primary"
                            sx={{ mt: 0.5, lineHeight: 1.2 }}
                        >
                            {test.title}
                        </Typography>
                    </Box>
                </Stack>

                {/* Progress Bar */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            Question {currentIndex + 1} of {test.questions.length}
                        </Typography>
                        <Typography variant="body2" color="primary" fontWeight="bold">
                            {Math.round(progress)}%
                        </Typography>
                    </Stack>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 10, borderRadius: 5, bgcolor: 'action.hover' }}
                    />
                </Box>

                {/* Question Card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: '24px',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        boxShadow: '0px 10px 30px rgba(0,0,0,0.05)'
                    }}
                >
                    {q.mediaUrl && (
                        <Box sx={{
                            width: '100%',
                            mb: 4,
                            borderRadius: '20px',
                            overflow: 'hidden',
                            bgcolor: 'grey.100',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <img
                                src={getFullImageUrl(q.mediaUrl)}
                                alt="Reference"
                                style={{ width: '100%', maxHeight: '350px', objectFit: 'contain', display: 'block' }}
                            />
                        </Box>
                    )}

                    <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, lineHeight: 1.5, color: 'text.primary' }}>
                        {q.type === 'StarPuzzle' && <StarIcon sx={{ color: 'warning.main', mr: 1, verticalAlign: 'text-bottom' }} />}
                        {q.questionText}
                    </Typography>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                        gap: 3,
                        mb: 4
                    }}>
                        {renderedOptions}
                    </Box>

                    {/* Navigation */}
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Button
                            size="large"
                            variant="contained"
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex(i => i - 1)}
                            startIcon={<ArrowBackIosNewIcon />}
                            sx={{ borderRadius: '14px', px: 3, fontWeight: 'bold' }}
                        >
                            Prev Question
                        </Button>

                        <Button
                            size="large"
                            variant="contained"
                            color={currentIndex === test.questions.length - 1 ? "success" : "primary"}
                            disabled={!userAnswers[q.id!]}
                            onClick={currentIndex === test.questions.length - 1 ? handleSubmit : () => setCurrentIndex(i => i + 1)}
                            endIcon={currentIndex === test.questions.length - 1 ? <CheckCircleIcon /> : <ArrowForwardIosIcon />}
                            sx={{
                                borderRadius: '14px',
                                px: 6,
                                fontWeight: 'bold',
                                boxShadow: theme.shadows[8]
                            }}
                        >
                            {currentIndex === test.questions.length - 1 ? "Finish Quiz" : "Next Question"}
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </PageLayout>
    );
}