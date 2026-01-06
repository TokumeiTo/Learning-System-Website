import { useLocation, useNavigate } from "react-router-dom";
import { kanjiQuizMock } from "../../mocks/quiz.mock";
import QuizResultSummary from "../../components/quiz/QuizResultSummary";
import { Box } from "@mui/material";

export default function QuizResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const answers: Record<string, string> = location.state?.answers || {};
  const quiz = kanjiQuizMock;

  const correctCount = quiz.questions.filter(
    (q) => answers[q.id] === q.correctOptionId
  ).length;
  const score = Math.round((correctCount / quiz.questions.length) * 100);

  return (
    <Box sx={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
      <QuizResultSummary
        score={score}
        passScore={quiz.passScore}
        onRetry={() => navigate("/quiz/start")}
      />
    </Box>
  );
}
