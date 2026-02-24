import { useState } from 'react';
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, Alert } from '@mui/material';
import { CheckCircle, Cancel, Send, Refresh } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface QuizData {
    questions: Question[];
    passingGrade?: number; // Now dynamic from the Admin Creator
}

interface Props {
    data: QuizData;
    onFinish: (score: number, passed: boolean) => void; // Parent now expects passed status
    isLocked?: boolean;
}

const QuizViewer = ({ data, onFinish, isLocked }: Props) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const passingThreshold = data.passingGrade ?? 70; // Fallback to 70 if not set

    const handleOptionChange = (qIndex: number, value: string) => {
        if (submitted || isLocked) return;
        setAnswers({ ...answers, [qIndex]: value });
    };

    const handleSubmit = () => {
        if (isLocked) return;

        let correctCount = 0;
        data.questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) correctCount++;
        });

        const finalScore = Math.round((correctCount / data.questions.length) * 100);
        const hasPassed = finalScore >= passingThreshold;

        setScore(finalScore);
        setSubmitted(true);

        // Notify parent with the dynamic results
        onFinish(finalScore, hasPassed);
    };

    if (!data.questions || data.questions.length === 0) return null;

    return (
        <Paper sx={{ bgcolor: '#1e293b'}}>
            <Typography variant="h6" sx={{ color: '#818cf8', mb: 3, fontWeight: 700 }}>
                Knowledge Check 
                {isLocked && <Typography component="span" sx={{ ml: 2, color: '#10b981', fontSize: '0.8rem' }}>(Completed)</Typography>}
            </Typography>

            <Stack spacing={4}>
                {data.questions.map((q, index) => (
                    <Box key={index} sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
                        <Typography sx={{ color: 'white', mb: 2, fontWeight: 500 }}>
                            {index + 1}. {q.question}
                        </Typography>

                        <RadioGroup
                            value={answers[index] || ''}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                        >
                            {q.options.map((opt, optIdx) => {
                                const isCorrect = opt === q.correctAnswer;
                                const isSelected = answers[index] === opt;

                                let labelColor = 'rgba(255,255,255,0.7)';
                                if (submitted || isLocked) {
                                    if (isCorrect) labelColor = '#10b981';
                                    else if (isSelected) labelColor = '#f43f5e';
                                }

                                return (
                                    <FormControlLabel
                                        key={optIdx}
                                        value={opt}
                                        control={<Radio size="small" sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#818cf8' } }} />}
                                        label={opt}
                                        disabled={submitted || isLocked}
                                        sx={{
                                            color: labelColor,
                                            transition: '0.2s',
                                            '& .MuiTypography-root': { fontSize: '0.95rem' }
                                        }}
                                    />
                                );
                            })}
                        </RadioGroup>
                    </Box>
                ))}
            </Stack>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <AnimatePresence mode="wait">
                    {!submitted && !isLocked ? (
                        <Button
                            variant="contained"
                            startIcon={<Send />}
                            onClick={handleSubmit}
                            disabled={Object.keys(answers).length < data.questions.length}
                            sx={{ bgcolor: '#6366f1', px: 4, borderRadius: 2, textTransform: 'none' }}
                        >
                            Submit Quiz
                        </Button>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Alert
                                severity={score >= passingThreshold ? "success" : "error"}
                                icon={score >= passingThreshold ? <CheckCircle /> : <Cancel />}
                                sx={{ 
                                    borderRadius: 2, 
                                    bgcolor: score >= passingThreshold ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', 
                                    color: 'white',
                                    '& .MuiAlert-icon': { color: score >= passingThreshold ? '#10b981' : '#f43f5e' }
                                }}
                            >
                                <Typography fontWeight={700}>
                                    Score: {score}% — {score >= passingThreshold ? "Passed!" : "Keep Practicing!"}
                                </Typography>
                                <Typography variant="caption">
                                    Required: {passingThreshold}%
                                </Typography>
                            </Alert>
                            
                            {/* Only show Try Again if they failed and the lesson isn't locked */}
                            {score < passingThreshold && !isLocked && (
                                <Button
                                    size="small"
                                    startIcon={<Refresh />}
                                    sx={{ mt: 1, color: '#818cf8', textTransform: 'none' }}
                                    onClick={() => { setSubmitted(false); setAnswers({}); }}
                                >
                                    Try Again
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