import { Box, Card, IconButton, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import HistoryIcon from "@mui/icons-material/History";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FiberNewIcon from "@mui/icons-material/FiberNew";

type TestCondition = "tested" | "testing" | "untested";

type Test = {
    id: number;
    title: string;
    condition: TestCondition;
    correct?: number;
    wrong?: number;
};

export default function QuizListPage() {
    const navigate = useNavigate();
    const { state } = useLocation() as {
        state: { level: string; type: string };
    };

    // Add correct/wrong counts for tested tests
    const tests: Test[] = [
        { id: 1, title: `${state.level} ${state.type} Test 1`, condition: "tested", correct: 4, wrong: 1 },
        { id: 2, title: `${state.level} ${state.type} Test 2`, condition: "tested", correct: 3, wrong: 2 },
        { id: 3, title: `${state.level} ${state.type} Test 3`, condition: "tested", correct: 5, wrong: 0 },
        { id: 4, title: `${state.level} ${state.type} Test 4`, condition: "untested" },
        { id: 5, title: `${state.level} ${state.type} Test 5`, condition: "untested" },
        { id: 6, title: `${state.level} ${state.type} Test 6`, condition: "testing" },
        { id: 7, title: `${state.level} ${state.type} Test 7`, condition: "testing" },
        { id: 8, title: `${state.level} ${state.type} Test 8`, condition: "untested" },
        { id: 9, title: `${state.level} ${state.type} Test 9`, condition: "tested", correct: 2, wrong: 3 },
        { id: 10, title: `${state.level} ${state.type} Test 10`, condition: "untested" },
    ];

    const getConditionText = (condition: TestCondition) => {
        switch (condition) {
            case "tested":
                return "Completed";
            case "testing":
                return "In Progress";
            case "untested":
            default:
                return "Untested";
        }
    };

    const getConditionIcon = (test: Test) => {
        let bgColor: string;
        switch (test.condition) {
            case "tested":
                bgColor = "success.main";   // green
                break;
            case "testing":
                bgColor = "primary.main";   // blue
                break;
            case "untested":
            default:
                bgColor = "error.main";     // red
                break;
        }

        if (test.condition === "tested") {
            return (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: 'space-around',
                        alignItems: "center",
                        minHeight: '80px',
                        p: 1,
                        bgcolor: bgColor,
                        borderRadius: 1,
                        color: "white", // text/icons visible on colored bg
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{getConditionText(test.condition)}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CheckIcon sx={{ color: 'lightgreen' }} /> {test.correct ?? 0}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ClearIcon sx={{ color: "error.main" }} /> {test.wrong ?? 0}
                        </Box>
                        <Typography variant="subtitle2" bgcolor='lightGreen' px={0.5} borderRadius={1}>Passed</Typography>
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
                    minHeight: '80px',
                    p: 1,
                    bgcolor: bgColor,
                    borderRadius: 1,
                    color: "white",
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{getConditionText(test.condition)}</Typography>
                {test.condition === "testing" ? <HistoryIcon /> : <FiberNewIcon />}
            </Box>
        );
    };


    return (
        <>
            {/* Header */}
            <Card elevation={5} sx={{ display: "flex", alignItems: "center", mb: 2, p: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: "primary.main", mr: 2 }}>
                    <ArrowBackIcon fontSize="large" />
                </IconButton>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: "bold" }}>
                    {state.level} – {state.type}
                </Typography>
            </Card>

            {/* Test Cards */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
                {tests.map((test) => (
                    <Card
                        elevation={5}
                        key={test.id}
                        onClick={() => navigate("/quiz/intro", { state: test })}
                        
                        sx={{
                            cursor: "pointer",
                            minWidth: 200,
                            minHeight: 170,
                        }}
                    >
                        <Box sx={{ mt: '1px' }}>{getConditionIcon(test)}</Box>
                        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', height: '40%'}}>
                            <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
                                {test.title}
                            </Typography>
                        </Box>
                    </Card>
                ))}
            </Box>
        </>
    );
}
