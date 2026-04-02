import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Stack, LinearProgress, Paper } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { fetchQuizById, submitLessonTest, fetchMyAttemptHistory } from '../../api/test.api';
import QuizResultSummary from '../../components/quiz/QuizResultSummary';
import type { Test, LessonResult } from '../../types_interfaces/test';
import getFullImageUrl from '../../utils/getFullImageUrl';
import PageLayout from '../../components/layout/PageLayout';

// 1. Memoized Option Component to prevent re-renders of unclicked cards
const OptionButton = React.memo(({ id, text, isSelected, onClick }: {
    id: string,
    text: string,
    isSelected: boolean,
    onClick: (id: string) => void
}) => {
    const isImage = text.startsWith('/uploads') || text.startsWith('http');

    return (
        <Paper
            elevation={isSelected ? 4 : 0}
            onClick={() => onClick(id)}
            sx={{
                p: isImage ? 1.5 : 2.5,
                width: '100%',
                minHeight: '80px',
                borderRadius: '16px',
                cursor: 'pointer',
                bgcolor: isSelected ? '#3498db' : '#2d3748',
                color: 'white',
                border: '2px solid',
                borderColor: isSelected ? '#5dade2' : '#3e4a5d',
                transition: 'all 0.15s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                '&:hover': {
                    bgcolor: isSelected ? '#3498db' : '#3e4a5d',
                    transform: 'translateY(-2px)'
                }
            }}
        >
            {isImage ? (
                <img
                    src={getFullImageUrl(text)}
                    alt="Option"
                    style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'contain', borderRadius: '8px' }}
                />
            ) : (
                <Typography sx={{ fontWeight: 600, textAlign: 'center' }}>{text}</Typography>
            )}
        </Paper>
    );
});

export default function QuizActivePage() {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

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
                console.error("Failed to load quiz:", error);
                navigate('/quiz');
            }
        };
        initPage();
    }, [testId, navigate, location.state]);

    // 2. Memoized Selection Handler
    const handleSelect = useCallback((optionId: string) => {
        if (!test) return;
        const questionId = test.questions[currentIndex]?.id;
        if (!questionId) return;

        setUserAnswers(prev => ({ ...prev, [questionId]: optionId }));
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

    // 3. Memoized Options List - This is the core of the performance fix
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
        return (
            <QuizResultSummary
                test={test}
                results={results}
                onRetry={() => {
                    setResults(null);
                    setCurrentIndex(0);
                    setUserAnswers({});
                }}
                onBackToList={() => navigate(-1)}
            />
        );
    }

    if (!test) {
        return (
            <PageLayout>
                <Box sx={{ width: '100%', mt: 4, px: 3 }}>
                    <LinearProgress color="info" />
                    <Typography sx={{ color: '#a0aec0', mt: 2, textAlign: 'center' }}>
                        Loading Quiz Questions...
                    </Typography>
                </Box>
            </PageLayout>
        );
    }

    if (!q) return <PageLayout>No questions found.</PageLayout>;

    const progress = ((currentIndex + 1) / test.questions.length) * 100;

    return (
        <PageLayout>
            <Box sx={{ px: 3, maxWidth: 800, mx: 'auto', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5 }}>
                    <Typography variant="h3" sx={{ color: '#a0aec0', fontWeight: 'bold' }}>
                        {test.category} Quiz
                    </Typography>
                    <Button onClick={() => navigate(-1)} sx={{color:'text.secondary', borderColor: '#4a5568' }}>
                        Back to List
                    </Button>
                </Box>

                <LinearProgress variant="determinate" value={progress} sx={{ mb: 2, height: 10, borderRadius: 5, bgcolor: '#2d3748' }} />

                <Box sx={{ display: 'flex', justifyContent: "space-between", mb: 5 }}>
                    <Typography variant="h6" sx={{ color: '#a0aec0', fontWeight: 'bold' }}>{test.title}</Typography>
                    <Typography variant="h6" sx={{ color: '#a0aec0', fontWeight: 'bold' }}>
                        {currentIndex + 1} / {test.questions.length}
                    </Typography>
                </Box>

                <Paper sx={{p:5, border:'1px dashed gray', borderRadius:'10px'}}>
                    {q.mediaUrl && (
                        <Box sx={{ width: '100%', mb: 3, borderRadius: '16px', overflow: 'hidden', border: '1px solid #4a5568', bgcolor: '#000' }}>
                            <img src={getFullImageUrl(q.mediaUrl)} alt="Reference" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                        </Box>
                    )}

                    <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, lineHeight: 1.4 }}>
                        {q.type === 'StarPuzzle' && <StarIcon sx={{ color: '#f6ad55', mr: 1, verticalAlign: 'middle' }} />}
                        {q.questionText}
                    </Typography>

                    <Box sx={{ mb: 6, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        {renderedOptions}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', pt: 4 }}>
                        <Button
                            variant="outlined"
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex(i => i - 1)}
                            sx={{ color: 'white', borderColor: '#4a5568', borderRadius: '12px', px: 3 }}
                        >
                            Previous
                        </Button>

                        <Button
                            variant="contained"
                            color={currentIndex === test.questions.length - 1 ? "warning" : "primary"}
                            disabled={!userAnswers[q.id!]}
                            onClick={currentIndex === test.questions.length - 1 ? handleSubmit : () => setCurrentIndex(i => i + 1)}
                            sx={{ borderRadius: '12px', px: 4, fontWeight: 'bold', bgcolor: currentIndex === test.questions.length - 1 ? '' : '#3498db' }}
                        >
                            {currentIndex === test.questions.length - 1 ? "Finish Quiz" : "Next"}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </PageLayout >
    );
}