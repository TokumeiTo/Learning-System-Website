import { useLocation, useNavigate } from "react-router-dom";
import { kanjiQuizMock } from "../../mocks/quiz.mock";
import { Card, Typography, Button } from "@mui/material";

export default function QuizReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const answers: Record<string, string> = location.state?.answers || {};

  return (
    <Card sx={{ p: 4 }}>
      <Typography variant="h5">Review Answers</Typography>

      {kanjiQuizMock.questions.map((q) => (
        <Card key={q.id} sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5" }}>
          <Typography>{q.question}</Typography>
          {q.options.map((opt) => (
            <Typography
              key={opt.id}
              sx={{
                color:
                  opt.id === q.correctOptionId
                    ? "green"
                    : opt.id === answers[q.id]
                    ? "orange"
                    : "black",
                fontWeight: opt.id === q.correctOptionId ? "bold" : "normal",
              }}
            >
              {opt.text} {opt.id === answers[q.id] ? "(Your answer)" : ""}
            </Typography>
          ))}
        </Card>
      ))}

      <Button sx={{ mt: 3 }} variant="contained" onClick={() => navigate(-1)}>
        Back to Quiz List
      </Button>
    </Card>
  );
}
