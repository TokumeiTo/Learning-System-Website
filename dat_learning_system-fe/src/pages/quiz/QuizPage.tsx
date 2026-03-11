import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, LinearProgress, Paper } from "@mui/material";
import { fetchJlptQuestions, submitJlptQuiz } from "../../api/jlpt_quiz.api";
import type { QuizQuestionDto, QuizAnswerDto } from "../../types_interfaces/jlptquiz";

export default function QuizPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { testId, sessionId, title } = location.state || {};

    const [questions, setQuestions] = useState<QuizQuestionDto[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswerDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!testId) {
            navigate("/quiz"); // Safety redirect
            return;
        }

        const loadQuestions = async () => {
            try {
                const data = await fetchJlptQuestions(testId);
                setQuestions(data);
            } catch (err) {
                console.error("Load failed", err);
            } finally {
                setLoading(false);
            }
        };
        loadQuestions();
    }, [testId]);

    const handleAnswerSelect = (answer: string) => {
        const newAnswer: QuizAnswerDto = {
            quizItemId: questions[currentIndex].quizItemId,
            selectedAnswer: answer
        };

        // Update answers array (replace if exists)
        setAnswers(prev => {
            const existing = prev.filter(a => a.quizItemId !== newAnswer.quizItemId);
            return [...existing, newAnswer];
        });

        // Move to next question automatically if not the last one
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleSubmit = async () => {
        const result = await submitJlptQuiz({
            sessionId: sessionId,
            answers: answers
        });
        navigate("/quiz/result", { state: { result } });
    };

    if (loading) return <LinearProgress />;

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" mb={2}>{title}</Typography>
            
            <Box mb={4}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="caption">Question {currentIndex + 1} of {questions.length}</Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h6" mb={4}>{currentQuestion?.prompt}</Typography>
                
                {/* We will build specific UI for GrammarStar here soon */}
                <Box sx={{ display: 'grid', gap: 2 }}>
                    {currentQuestion?.options.map((opt, idx) => (
                        <Button 
                            key={idx} 
                            variant="outlined" 
                            fullWidth
                            onClick={() => handleAnswerSelect(opt)}
                        >
                            {opt}
                        </Button>
                    ))}
                </Box>
            </Paper>

            <Box mt={4} display="flex" justifyContent="space-between">
                <Button 
                    disabled={currentIndex === 0} 
                    onClick={() => setCurrentIndex(currentIndex - 1)}
                >
                    Back
                </Button>
                {currentIndex === questions.length - 1 && (
                    <Button variant="contained" color="success" onClick={handleSubmit}>
                        Submit Quiz
                    </Button>
                )}
            </Box>
        </Box>
    );
}