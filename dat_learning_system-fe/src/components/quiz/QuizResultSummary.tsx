import { Box, Typography, Button, Paper, Divider, Stack, Chip } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";

interface ResultDetail {
    questionPrompt: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
}

interface QuizResultSummaryProps {
    score: number;
    totalPoints: number;
    results: ResultDetail[];
    onRetry: () => void;
    onBackToList: () => void;
}

export default function QuizResultSummary({ 
    score, 
    totalPoints, 
    results, 
    onRetry, 
    onBackToList 
} : QuizResultSummaryProps) {
    const percentage = Math.round((score / totalPoints) * 100);
    const isPassed = percentage >= 80; // Standard JLPT passing threshold

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            {/* SCORE CARD */}
            <Paper elevation={0} sx={{ 
                p: 5, mb: 4, borderRadius: 6, textAlign: 'center', 
                bgcolor: isPassed ? 'success.light' : 'error.light',
                color: isPassed ? 'success.contrastText' : 'error.contrastText'
            }}>
                <Typography variant="h5" fontWeight="700" gutterBottom>
                    {isPassed ? "Great Job! お疲れ様でした！" : "Keep Practicing! 頑張って！"}
                </Typography>
                <Typography variant="h2" fontWeight="900">
                    {percentage}%
                </Typography>
                <Typography variant="subtitle1">
                    Score: {score} / {totalPoints} Points
                </Typography>
            </Paper>

            <Typography variant="h6" fontWeight="bold" mb={2}>Review Results</Typography>
            
            <Stack spacing={2} mb={5}>
                {results.map((res, index) => (
                    <Paper key={index} sx={{ p: 3, borderRadius: 3, borderLeft: `6px solid ${res.isCorrect ? '#4caf50' : '#f44336'}` }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Question {index + 1}
                            </Typography>
                            {res.isCorrect ? 
                                <Chip icon={<CheckCircleOutlineIcon />} label="Correct" color="success" size="small" /> : 
                                <Chip icon={<ErrorOutlineIcon />} label="Incorrect" color="error" size="small" />
                            }
                        </Box>

                        <Typography variant="h6" sx={{ mb: 2 }}>{res.questionPrompt}</Typography>
                        
                        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">Your Answer (★)</Typography>
                                <Typography fontWeight="bold" color={res.isCorrect ? "success.main" : "error.main"}>
                                    {res.userAnswer || "No Answer"}
                                </Typography>
                            </Box>
                            {!res.isCorrect && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">Correct Answer (★)</Typography>
                                    <Typography fontWeight="bold" color="success.main">
                                        {res.correctAnswer}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                ))}
            </Stack>

            {/* ACTION BUTTONS */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                    variant="outlined" 
                    startIcon={<HomeIcon />} 
                    onClick={onBackToList}
                    sx={{ borderRadius: 10, px: 4 }}
                >
                    Menu
                </Button>
                <Button 
                    variant="contained" 
                    startIcon={<RefreshIcon />} 
                    onClick={onRetry}
                    sx={{ borderRadius: 10, px: 4 }}
                >
                    Try Again
                </Button>
            </Box>
        </Box>
    );
}