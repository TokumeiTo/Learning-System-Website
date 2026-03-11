import { Box, Card, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import ProgressCircle from "../../components/chartAndProgress/ProgressCircle";
import { fetchJlptHistory } from "../../api/jlpt_quiz.api";

const LEVELS = ["N5", "N4", "N3", "N2", "N1"] as const;
type Level = typeof LEVELS[number];

const QUIZ_TYPE_ITEMS = [
    { key: "Vocabulary", label: "Vocabulary" },
    { key: "Grammar", label: "Grammar" },
    { key: "Onomatopoeia", label: "Onomatopoeia" },
    { key: "Kanji", label: "Kanji" },
] as const;

export default function QuizSetupPage() {
    const [level, setLevel] = useState<Level>("N5");
    const [stats, setStats] = useState<Record<string, number>>({});
    const navigate = useNavigate();
    const theme = useTheme();

    // In a real app, you'd calculate progress based on history
    useEffect(() => {
        const loadProgress = async () => {
            const history = await fetchJlptHistory();
            // Logic to calculate % completed per category for the current level
            // For now, using placeholder logic
            setStats({ Vocabulary: 40, Grammar: 15, Kanji: 80, Onomatopoeia: 0 });
        };
        loadProgress();
    }, [level]);

    const handleClick = (category: string) => {
        navigate("/quiz/list", { state: { level, category } });
    };

    return (
        <PageLayout>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', p: 6 }}>
                <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 5 }}>
                    {QUIZ_TYPE_ITEMS.map((item) => (
                        <Card
                            elevation={5}
                            key={item.key}
                            onClick={() => handleClick(item.key)}
                            sx={{ textAlign: "center", width: "40%", p: 3, cursor: "pointer", minWidth: '200px' }}
                        >
                            <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold' }}>
                                {item.label}
                            </Typography>
                            <Box mt={2}>
                                <ProgressCircle value={stats[item.key] || 0} />
                            </Box>
                        </Card>
                    ))}
                </Box>

                {/* Level Tabs stick to bottom as per your design */}
                <Box bgcolor="primary.main" sx={{ position: 'fixed', bottom: 20, borderRadius: '20px', boxShadow: 3 }}>
                    <Tabs value={level} onChange={(_, v) => setLevel(v)} centered sx={{ "& .MuiTab-root": { color: "white" } }}>
                        {LEVELS.map((lvl) => <Tab key={lvl} label={lvl} value={lvl} />)}
                    </Tabs>
                </Box>
            </Box>
        </PageLayout>
    );
}