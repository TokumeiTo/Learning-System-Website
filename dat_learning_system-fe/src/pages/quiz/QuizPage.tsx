import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Stack,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TimerIcon from "@mui/icons-material/Timer";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { kanjiQuizMock } from "../../mocks/quiz.mock";
import QuestionCard from "../../components/quiz/QuestionCard";
import QuizProgress from "../../components/quiz/QuizProgress";
import { useNavigate } from "react-router-dom";

const QUIZ_TIME = 60 * 5; // 5 minutes

export default function QuizPage() {
  const quiz = kanjiQuizMock;
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);

  const currentQuestion = quiz.questions[currentIndex];

  /* ---------------- Timer ---------------- */
  useEffect(() => {
    if (timeLeft <= 0) {
      navigate("/quiz/result", { state: { answers } });
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  /* -------- Prevent tab close -------- */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  /* -------- Keyboard shortcuts -------- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const handleAnswer = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      navigate("/quiz/result", { state: { answers } });
    }
  };

  const handlePrev = () => {
    if (currentIndex === 0) {
      const confirmLeave = window.confirm(
        "Leave quiz? Your progress will be lost."
      );
      if (confirmLeave) navigate("/quiz");
    } else {
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <Box sx={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
      <Card
        sx={{
          p: 4,
          maxWidth: 720,
          minWidth: 520,
          borderRadius: 3,
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <HelpOutlineIcon color="primary" />
            <Typography variant="h6">Kanji Quiz</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <TimerIcon fontSize="small" />
            <Typography variant="body2">
              {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </Typography>
          </Stack>
        </Stack>

        <QuizProgress
          current={currentIndex + 1}
          total={quiz.questions.length}
        />

        <Divider sx={{ my: 2 }} />

        <QuestionCard
          question={currentQuestion}
          selectedOption={answers[currentQuestion.id]}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />

        {/* Action Bar */}
        <Stack
          direction="row"
          justifyContent="space-between"
          mt={3}
          spacing={2}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handlePrev}
          >
            {currentIndex === 0 ? "Exit" : "Previous"}
          </Button>

          <Button
            variant="contained"
            endIcon={
              currentIndex === quiz.questions.length - 1 ? (
                <CheckCircleIcon />
              ) : (
                <ArrowForwardIcon />
              )
            }
            onClick={handleNext}
          >
            {currentIndex === quiz.questions.length - 1
              ? "Submit Quiz"
              : "Next"}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
