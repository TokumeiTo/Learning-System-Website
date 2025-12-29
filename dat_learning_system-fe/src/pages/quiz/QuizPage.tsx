import { useState, useEffect } from "react";
import { Button, Card } from "@mui/material";
import { kanjiQuizMock } from "../../mocks/quiz.mock";
import QuestionCard from "../../components/quiz/QuestionCard";
import QuizProgress from "../../components/quiz/QuizProgress";
import { useNavigate } from "react-router-dom";

export default function QuizPage() {
  const quiz = kanjiQuizMock;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const currentQuestion = quiz.questions[currentIndex];

  const handleAnswer = (optionId: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
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
      // Warn if test is not complete before leaving
      const confirmLeave = window.confirm(
        "Are you sure you want to go back? Your progress will be lost."
      );
      if (confirmLeave) navigate("/quiz");
    } else {
      setCurrentIndex((i) => i - 1);
    }
  };

  // Warn user if they try to close/refresh tab mid-quiz
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave? Your progress will be lost.";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <Card sx={{ p: 4 }}>
      <QuizProgress current={currentIndex + 1} total={quiz.questions.length} />

      <QuestionCard
        question={currentQuestion}
        selectedOption={answers[currentQuestion.id]}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <Button variant="outlined" onClick={handlePrev}>
          {currentIndex === 0 ? "Back to Quiz List" : "Previous"}
        </Button>

        <Button variant="contained" onClick={handleNext}>
          {currentIndex === quiz.questions.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </Card>
  );
}
