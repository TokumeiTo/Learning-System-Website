import { useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import HistoryIcon from "@mui/icons-material/History";
import FiberNewIcon from "@mui/icons-material/FiberNew";

import QuizNav from "../../components/quiz/QuizNav";
import QuizIntroModal from "../../components/quiz/QuizIntroModal";

type TestCondition = "tested" | "testing" | "untested";

type Test = {
    id: number;
    title: string;
    condition: TestCondition;
    correct?: number;
    wrong?: number;
};

export default function QuizListPage() {
    const [selectedTest, setSelectedTest] = useState<Test | null>(null);

    const state = { level: "N5", type: "Kanji" }; // for demo

    const tests: Test[] = [
        { id: 1, title: `${state.level} ${state.type} Test 1`, condition: "tested", correct: 4, wrong: 1 },
        { id: 2, title: `${state.level} ${state.type} Test 2`, condition: "tested", correct: 3, wrong: 2 },
        { id: 3, title: `${state.level} ${state.type} Test 3`, condition: "tested", correct: 5, wrong: 0 },
        { id: 4, title: `${state.level} ${state.type} Test 4`, condition: "untested" },
        { id: 5, title: `${state.level} ${state.type} Test 5`, condition: "untested" },
        { id: 6, title: `${state.level} ${state.type} Test 6`, condition: "testing" },
    ];

    const getConditionIcon = (test: Test) => {
        let bgColor: string;
        switch (test.condition) {
            case "tested":
                bgColor = "success.main";
                break;
            case "testing":
                bgColor = "primary.main";
                break;
            case "untested":
            default:
                bgColor = "error.main";
                break;
        }

        if (test.condition === "tested") {
            return (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        minHeight: 100,
                        width: '100%',
                        bgcolor: bgColor,
                        borderRadius: 1,
                        color: "white",
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        Completed
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CheckIcon sx={{ color: "lightgreen" }} /> {test.correct ?? 0}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ClearIcon sx={{ color: "error.main" }} /> {test.wrong ?? 0}
                        </Box>
                    </Box>
                </Box>
            );
        }

        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    minHeight: 100,
                    width: '100%',
                    bgcolor: bgColor,
                    borderRadius: 1,
                    color: "white",
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {test.condition === "testing" ? "In Progress" : "Untested"}
                </Typography>
                {test.condition === "testing" ? <HistoryIcon /> : <FiberNewIcon />}
            </Box>
        );
    };

    return (
        <Box sx={{ height: "100vh" }}>
            <QuizNav level={state.level} type={state.type} />

            {/* Test Cards */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 3,
                }}
            >
                {tests.map((test) => (
                    <Card
                        key={test.id}
                        onClick={() => setSelectedTest(test)}
                        elevation={5}
                        sx={{
                            cursor: "pointer",
                            minWidth: 200,
                            minHeight: 170,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "0.3s",
                            "&:hover": { transform: "scale(1.05)" },
                        }}
                    >
                        {getConditionIcon(test)}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "40%",
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    color: "primary.main",
                                }}
                            >
                                {test.title}
                            </Typography>
                        </Box>
                    </Card>
                ))}
            </Box>

            {/* ---------- Show Modal ---------- */}
            {selectedTest && (
                <QuizIntroModal
                    test={selectedTest}
                    level={state.level}
                    type={state.type}
                    onClose={() => setSelectedTest(null)}
                />
            )}

        </Box>
    );
}
