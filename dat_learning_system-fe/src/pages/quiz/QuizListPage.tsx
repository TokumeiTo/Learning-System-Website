import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Box, Card, Typography, Button, 
    Stack, Paper, Dialog, IconButton, Fade 
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { fetchJlptTests, fetchJlptHistory, startQuizSession } from "../../api/jlpt_quiz.api";
import type { JlptTestDto, QuizSession } from "../../types_interfaces/jlptquiz";
import QuizIntroModal from "../../components/quiz/QuizIntroModal";
import PageLayout from "../../components/layout/PageLayout";
import JapaneseTabLoader from "../../components/feedback/TabLoader";

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
            // Smooth transition for the loader
            setTimeout(() => setLoading(false), 800);
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
            <Box sx={{ 
                p: { xs: 2, md: 4 }, 
                minHeight: '100vh', 
                bgcolor: '#1e293b', 
                color: 'white',
                pb: 10 
            }}>
                
                {/* Header: Back Button & Title */}
                <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                    <IconButton onClick={() => navigate(-1)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                        <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900 }}>{level} {category}</Typography>
                        <Typography variant="caption" sx={{ color: '#a0aec0', letterSpacing: 1 }}>
                            SELECT A TEST TO BEGIN
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton 
                        onClick={() => setIsAdminMode(!isAdminMode)}
                        sx={{ color: isAdminMode ? '#f6ad55' : '#a0aec0' }}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Stack>

                {/* Admin Creator Panel */}
                {isAdminMode && (
                    <Fade in={isAdminMode}>
                        <Box sx={{ mb: 4 }}>
                            {!showCreator ? (
                                <Button 
                                    fullWidth 
                                    variant="outlined" 
                                    startIcon={<AddIcon />}
                                    onClick={() => setShowCreator(true)}
                                    sx={{ py: 2, borderStyle: 'dashed', borderRadius: 4, color: '#f6ad55', borderColor: '#f6ad55' }}
                                >
                                    Add New {category} Test
                                </Button>
                            ) : (
                                <Paper sx={{ p: 2, borderRadius: 4, bgcolor: '#2d3748', border: '1px solid #f6ad55' }}>
                                    <AdminQuizCreator 
                                        initialLevel={level} 
                                        initialCategory={category} 
                                        onSuccess={() => { setShowCreator(false); loadData(); }} 
                                    />
                                    <Button fullWidth color="inherit" onClick={() => setShowCreator(false)} sx={{ mt: 1 }}>Cancel</Button>
                                </Paper>
                            )}
                        </Box>
                    </Fade>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center' }}>
                        <JapaneseTabLoader />
                    </Box>
                ) : (
                    <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 2, 
                        justifyContent: { xs: 'center', sm: 'flex-start' } 
                    }}>
                        {tests.length > 0 ? tests.map((test) => {
                            const passed = history.some(h => h.testId === test.id && h.isPassed);
                            return (
                                <Card 
                                    key={test.id} 
                                    onClick={() => isAdminMode ? setEditingTestId(test.id) : setSelectedTest(test)}
                                    sx={{ 
                                        width: { xs: '45%', sm: 160 }, 
                                        aspectRatio: '1/1',
                                        borderRadius: '24px', 
                                        bgcolor: passed ? 'rgba(72, 187, 120, 0.1)' : '#2d3748',
                                        border: passed ? '2px solid #48bb78' : '1px solid #4a5568',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: '0.2s',
                                        '&:hover': { transform: 'scale(1.05)', bgcolor: '#334155' }
                                    }}
                                >
                                    {passed && (
                                        <CheckCircleIcon 
                                            sx={{ position: 'absolute', top: 12, right: 12, color: '#48bb78', fontSize: 20 }} 
                                        />
                                    )}
                                    
                                    <Typography variant="h4" sx={{ fontWeight: 900, color: passed ? '#48bb78' : 'white' }}>
                                        {/* Assumes title is "Test 1" etc, extract number if needed */}
                                        {test.title.match(/\d+/)?.[0] || '??'}
                                    </Typography>
                                    
                                    <Typography variant="caption" sx={{ color: '#a0aec0', fontWeight: 'bold', mt: 1 }}>
                                        {test.questionCount || 0} Qs
                                    </Typography>

                                    {isAdminMode && (
                                        <Box sx={{ position: 'absolute', bottom: 8, color: '#f6ad55' }}>
                                            <SettingsIcon sx={{ fontSize: 16 }} />
                                        </Box>
                                    )}
                                </Card>
                            );
                        }) : (
                            <Typography sx={{ color: '#a0aec0', textAlign: 'center', width: '100%', mt: 10 }}>
                                No assessments found for this category.
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Dialogs remain similar but styled with the dark theme */}
                <Dialog 
                    open={!!editingTestId} 
                    onClose={() => setEditingTestId(null)} 
                    maxWidth="sm" 
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 5, bgcolor: '#1e293b', color: 'white' } }}
                >
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton onClick={() => setEditingTestId(null)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
                        </Box>
                        {editingTestId && <AdminAddQuestion testId={editingTestId} />}
                        <Button fullWidth variant="contained" onClick={() => { setEditingTestId(null); loadData(); }} sx={{ mt: 3, borderRadius: 10, bgcolor: '#34a8fb' }}>
                            Save Changes
                        </Button>
                    </Box>
                </Dialog>

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