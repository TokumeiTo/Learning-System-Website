import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
    Box, 
    Typography, 
    LinearProgress, 
    Button, 
    Paper, 
    Container, 
    IconButton,
    Stack 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { fetchJlptQuestions, submitJlptQuiz } from "../../api/jlpt_quiz.api";
import type { QuizQuestionDto, QuizAnswerDto } from "../../types_interfaces/jlptquiz";
import StarPuzzle from "../../components/quiz/StarPuzzle";
import QuizResultSummary from "../../components/quiz/QuizResultSummary";

export default function QuizPage() {
    const { testId } = useParams<{ testId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    
    // sessionID comes from QuizIntroModal as a number
    const { sessionId } = (location.state as { sessionId: number }) || {};

    const [questions, setQuestions] = useState<QuizQuestionDto[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswerDto[]>([]);
    const [currentSelection, setCurrentSelection] = useState("");
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 1. Initial Load: Fetch questions based on the testId
    useEffect(() => {
        if (!testId) return;
        
        const loadQuestions = async () => {
            try {
                const data = await fetchJlptQuestions(testId);
                setQuestions(data);
            } catch (error) {
                console.error("Error loading quiz questions:", error);
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, [testId]);

    // 2. Handle Answer Selection and Navigation
    const handleNext = async () => {
        if (!currentSelection) return;

        const currentQuestion = questions[currentIndex];
        const newAnswer: QuizAnswerDto = { 
            quizItemId: currentQuestion.quizItemId, 
            selectedAnswer: currentSelection 
        };
        
        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);

        if (currentIndex < questions.length - 1) {
            // Move to next question
            setCurrentIndex(prev => prev + 1);
            setCurrentSelection(""); // Reset selection for the next puzzle
        } else {
            // Final Step: Submit all gathered answers
            setLoading(true);
            try {
                const finalResults = await submitJlptQuiz({ 
                    sessionId: sessionId, 
                    answers: updatedAnswers 
                });
                setResults(finalResults);
            } catch (error) {
                console.error("Submission failed:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) return <Box sx={{ width: '100%', mt: 10 }}><LinearProgress /></Box>;

    // 3. Show Results View if quiz is finished
    if (results) {
        return (
            <QuizResultSummary 
                results={results.details} 
                score={results.score} 
                totalPoints={results.totalPoints} 
                onRetry={() => window.location.reload()} 
                onBackToList={() => navigate(-1)} 
            />
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Header / Exit */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" fontWeight="bold">
                    JLPT Assessment
                </Typography>
            </Box>

            {/* Progress Section */}
            <Box sx={{ mb: 5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Question <b>{currentIndex + 1}</b> of {questions.length}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                        {Math.round(progress)}%
                    </Typography>
                </Stack>
                <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ height: 10, borderRadius: 5, bgcolor: 'grey.200' }} 
                />
            </Box>

            {/* Question Area */}
            <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 6, border: '1px solid', borderColor: 'divider' }}>
                <Box textAlign="center" mb={4}>
                    <Typography variant="h5" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
                        {currentQuestion.prompt}
                    </Typography>
                </Box>

                {/* The Interactive Star Puzzle */}
                <StarPuzzle 
                    key={currentQuestion.quizItemId} // Key forces re-mount to reset internal puzzle state
                    options={currentQuestion.options} 
                    onSelectionChange={setCurrentSelection} 
                />

                {/* Navigation Actions */}
                <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                        variant="contained" 
                        size="large" 
                        disabled={!currentSelection}
                        onClick={handleNext}
                        sx={{ 
                            borderRadius: 10, 
                            px: 10, 
                            py: 1.5,
                            fontSize: '1.1rem',
                            textTransform: 'none',
                            boxShadow: 4
                        }}
                    >
                        {currentIndex === questions.length - 1 ? "Submit Exam" : "Confirm & Next"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}