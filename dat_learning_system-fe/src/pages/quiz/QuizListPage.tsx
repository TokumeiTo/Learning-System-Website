import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Card, Typography, CircularProgress, Dialog } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from "@mui/icons-material/History";
import FiberNewIcon from "@mui/icons-material/FiberNew";

import { fetchJlptTests, fetchJlptHistory } from "../../api/jlpt_quiz.api";
import type { JlptTestDto, QuizSession } from "../../types_interfaces/jlptquiz";
import QuizIntroModal from "../../components/quiz/QuizIntroModal";
import AdminQuizCreator from "../../components/quiz/AdminQuizCreator";
import PageLayout from "../../components/layout/PageLayout";

export default function QuizListPage() {
    const location = useLocation();
    const { level, category } = location.state || { level: "N5", category: "Kanji" };

    const [tests, setTests] = useState<JlptTestDto[]>([]);
    const [history, setHistory] = useState<QuizSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState<JlptTestDto | null>(null);
    const [openAdminModal, setOpenAdminModal] = useState(false);

    const loadData = async () => {
        setLoading(true);
        const [testData, historyData] = await Promise.all([
            fetchJlptTests(level, category),
            fetchJlptHistory(category)
        ]);
        setTests(testData);
        setHistory(historyData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [level, category]);

    const getTestStatus = (testId: string) => {
        const session = history.find(h => h.testId === testId);
        if (!session) return { condition: "untested" };
        if (session.finishedAt) return {
            condition: "tested",
            score: session.finalScore,
            isPassed: session.isPassed
        };
        return { condition: "testing" };
    };

    

    return (
        <PageLayout>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" mb={4} textAlign="center">{level} {category} Tests</Typography>

                <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 3 }}>

                    {/* ADMIN: CREATE NEW TEST CARD */}
                    <Card
                        onClick={() => setOpenAdminModal(true)}
                        elevation={2}
                        sx={{
                            width: 220, minHeight: 180,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            border: '2px dashed', borderColor: 'primary.main', bgcolor: 'action.hover',
                            cursor: "pointer", transition: "0.3s", "&:hover": { transform: "scale(1.02)", bgcolor: 'white' }
                        }}
                    >
                        <AddCircleOutlineIcon color="primary" sx={{ fontSize: 50 }} />
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" mt={1}>
                            Create New Test
                        </Typography>
                    </Card>
                    {tests.map((test) => {
                        const status = getTestStatus(test.id);
                        return (
                            <Card
                                key={test.id}
                                onClick={() => setSelectedTest(test)}
                                elevation={5}
                                sx={{
                                    cursor: "pointer", width: 220, minHeight: 180,
                                    display: "flex", flexDirection: "column",
                                    transition: "0.3s", "&:hover": { transform: "scale(1.05)" }
                                }}
                            >
                                {/* Status Header */}
                                <Box sx={{
                                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                                    bgcolor: status.condition === "tested" ? "success.main" :
                                        status.condition === "testing" ? "primary.main" : "grey.400",
                                    color: "white", width: '100%'
                                }}>
                                    {status.condition === "tested" ? <CheckIcon /> :
                                        status.condition === "testing" ? <HistoryIcon /> : <FiberNewIcon />}
                                    <Typography ml={1} variant="subtitle2">
                                        {status.condition.toUpperCase()}
                                    </Typography>
                                </Box>

                                {/* Test Info */}
                                <Box sx={{ p: 2, textAlign: 'center', flex: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {test.title}
                                    </Typography>
                                    {status.condition === "tested" && (
                                        <Typography variant="caption" color="text.secondary">
                                            Last Score: {status.score}%
                                        </Typography>
                                    )}
                                </Box>
                            </Card>
                        );
                    })}
                </Box>

                <Dialog
                    open={openAdminModal}
                    onClose={() => setOpenAdminModal(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <AdminQuizCreator
                        initialLevel={level}
                        initialCategory={category}
                        onSuccess={() => {
                            setOpenAdminModal(false);
                            loadData(); // Refresh list to see new test
                        }}
                    />
                </Dialog>

                {selectedTest && (
                    <QuizIntroModal test={selectedTest} onClose={() => setSelectedTest(null)} />
                )}
            </Box>
        </PageLayout>
    );
}