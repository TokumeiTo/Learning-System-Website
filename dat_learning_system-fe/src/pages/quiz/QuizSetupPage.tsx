import {
    Box,
    Card,
    Tab,
    Tabs,
    Typography,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressCircle from "../../components/chartAndProgress/ProgressCircle";
import { progressByLevel } from "../../mocks/quiz.mock";
import type { Level, QuizProgress } from "../../types/quiz";
import PageLayout from "../../components/layout/PageLayout";

type QuizType = keyof QuizProgress;

const LEVELS: Level[] = ["N5", "N4", "N3", "N2", "N1"];

const QUIZ_TYPE_ITEMS: { key: QuizType; label: string }[] = [
    { key: "vocabulary", label: "Vocabulary" },
    { key: "grammar", label: "Grammar" },
    { key: "reading", label: "Reading" },
    { key: "kanji", label: "Kanji" },
];

export default function QuizSetupPage() {
    const [level, setLevel] = useState<Level>("N5");
    const navigate = useNavigate();

    const progress = progressByLevel[level];
    const theme = useTheme();

    const handleClick = (type: QuizType) => {
        navigate("/quiz/list", {
            state: { level, type },
        });
    };

    return (
        <PageLayout>
            {/* Quiz Type Cards */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                minHeight: '80vh',
                position: 'relative', p: 6
            }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 5,
                    }}
                >
                    {QUIZ_TYPE_ITEMS.map((item) => (
                        <Card
                            elevation={5}
                            key={item.key}
                            onClick={() => handleClick(item.key)}
                            sx={{
                                textAlign: "center",
                                width: "40%",
                                p: 3,
                                cursor: "pointer",
                                minWidth: '200px'
                            }}
                        >
                            <Typography variant="h5" color={theme.palette.text.tertiary} sx={{ fontWeight: 'bold' }}>
                                {item.label}
                            </Typography>
                            <Box mt={2}>
                                {/* Static ProgressCircle, no animation */}
                                <ProgressCircle value={progress[item.key]} />
                            </Box>
                        </Card>
                    ))}
                </Box>

                {/* Level Tabs */}
                <Box bgcolor="primary.main" sx={{ position: 'absolute', bottom: '10px', borderRadius: '0px 20px 0 20px', boxShadow: 3 }}>
                    <Tabs
                        value={level}
                        onChange={(_, v: Level) => setLevel(v)}
                        centered
                        sx={{
                            "& .MuiTab-root": {
                                color: "white",          // default tab color
                                fontWeight: 500,
                            },
                            "& .Mui-selected": {
                                bgcolor: "lightGreen",
                                fontWeight: "bold",
                                borderRadius: '0px 20px 0 20px',
                            },
                            "& .MuiTabs-indicator": {
                                backgroundColor: "white",
                                color: "primary.light",
                                height: '5px',
                                transition: 'all 0.1s ease',
                            },
                            outline: 'none',
                        }}
                    >
                        {LEVELS.map((lvl) => (
                            <Tab key={lvl} label={lvl} value={lvl} />
                        ))}
                    </Tabs>
                </Box>
            </Box>
        </PageLayout> // ✅ properly closed
    );
}
