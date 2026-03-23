import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Box, Card, Typography, LinearProgress, Button, 
    Stack, Paper, Dialog, Divider, IconButton 
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { fetchJlptTests, fetchJlptHistory, startQuizSession } from "../../api/jlpt_quiz.api";
import type { JlptTestDto, QuizSession } from "../../types_interfaces/jlptquiz";
import QuizIntroModal from "../../components/quiz/QuizIntroModal";
import PageLayout from "../../components/layout/PageLayout";

// Admin Components
import AdminQuizCreator from "../../components/admin/AdminQuizCreator";
import AdminAddQuestion from "../../components/admin/AdminAddQuestion";

export default function QuizListPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { level, category } = location.state || { level: "N3", category: "Grammar" };

    const [tests, setTests] = useState<JlptTestDto[]>([]);
    const [history, setHistory] = useState<QuizSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState<JlptTestDto | null>(null);

    // Admin States
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [showCreator, setShowCreator] = useState(false);
    const [editingTestId, setEditingTestId] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [testData, historyData] = await Promise.all([
                fetchJlptTests(level, category),
                fetchJlptHistory(category)
            ]);
            setTests(testData);
            setHistory(historyData);
        } catch (err) {
            console.error("Error loading quiz data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [level, category]);

    const handleStartQuiz = async (testId: string) => {
        try {
            const sessionId = await startQuizSession(testId);
            navigate(`/quiz/run/${testId}`, { state: { sessionId, level, category } });
        } catch (err) {
            console.error("Failed to initiate session", err);
        }
    };

    return (
        <PageLayout>
            <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
                
                {/* Header Section */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" fontWeight="800">{level} Assessment</Typography>
                        <Typography variant="subtitle1" color="text.secondary">{category}</Typography>
                    </Box>

                    <Button 
                        startIcon={<SettingsIcon />} 
                        variant={isAdminMode ? "contained" : "outlined"}
                        color={isAdminMode ? "secondary" : "inherit"}
                        onClick={() => setIsAdminMode(!isAdminMode)}
                        sx={{ borderRadius: 10 }}
                    >
                        {isAdminMode ? "Exit Management" : "Manage Quizzes"}
                    </Button>
                </Stack>

                {/* Admin Creator Panel */}
                {isAdminMode && (
                    <Box sx={{ mb: 4 }}>
                        {!showCreator ? (
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                startIcon={<AddIcon />}
                                onClick={() => setShowCreator(true)}
                                sx={{ py: 2, borderStyle: 'dashed', borderRadius: 4 }}
                            >
                                Create New {level} {category} Test Container
                            </Button>
                        ) : (
                            <Paper sx={{ p: 1, borderRadius: 4, border: '2px solid', borderColor: 'secondary.main' }}>
                                <AdminQuizCreator 
                                    initialLevel={level} 
                                    initialCategory={category} 
                                    onSuccess={() => {
                                        setShowCreator(false);
                                        loadData();
                                    }} 
                                />
                                <Box sx={{ px: 4, pb: 3 }}>
                                    <Button color="inherit" onClick={() => setShowCreator(false)}>Cancel</Button>
                                </Box>
                            </Paper>
                        )}
                    </Box>
                )}

                {loading ? <LinearProgress sx={{ mt: 4, borderRadius: 5 }} /> : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                        {tests.map((test) => {
                            const passed = history.some(h => h.testId === test.id && h.isPassed);
                            return (
                                <Card key={test.id} sx={{ p: 3, width: { xs: '100%', sm: 340 }, borderRadius: 5, boxShadow: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6" fontWeight="700">{test.title}</Typography>
                                        {passed && <CheckCircleIcon color="success" />}
                                    </Box>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        {test.questionCount || 0} Questions Linked
                                    </Typography>

                                    <Stack spacing={1}>
                                        <Button 
                                            fullWidth 
                                            variant="contained" 
                                            onClick={() => setSelectedTest(test)}
                                            startIcon={<PlayArrowIcon />}
                                            sx={{ borderRadius: 10, py: 1 }}
                                        >
                                            Start Quiz
                                        </Button>

                                        {isAdminMode && (
                                            <Button 
                                                fullWidth 
                                                variant="outlined" 
                                                color="secondary"
                                                onClick={() => setEditingTestId(test.id)}
                                                sx={{ borderRadius: 10 }}
                                            >
                                                Edit / Link Questions
                                            </Button>
                                        )}
                                    </Stack>
                                </Card>
                            );
                        })}
                    </Box>
                )}

                {/* Content Linker Dialog */}
                <Dialog 
                    open={!!editingTestId} 
                    onClose={() => setEditingTestId(null)} 
                    maxWidth="sm" 
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 5 } }}
                >
                    <Box sx={{ p: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                            <IconButton onClick={() => { setEditingTestId(null); loadData(); }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        {editingTestId && <AdminAddQuestion testId={editingTestId} />}
                        <Box sx={{ p: 3 }}>
                            <Button 
                                fullWidth 
                                variant="contained" 
                                onClick={() => { setEditingTestId(null); loadData(); }}
                                sx={{ borderRadius: 10 }}
                            >
                                Finished Editing
                            </Button>
                        </Box>
                    </Box>
                </Dialog>

                {/* Student Intro Modal */}
                {selectedTest && (
                    <QuizIntroModal 
                        test={selectedTest} 
                        onClose={() => setSelectedTest(null)} 
                        onStart={handleStartQuiz} 
                    />
                )}
            </Box>
        </PageLayout>
    );
}