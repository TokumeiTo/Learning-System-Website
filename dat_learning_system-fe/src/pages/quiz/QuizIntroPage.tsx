import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ProgressCircle from "../../components/chartAndProgress/ProgressCircle";
import { kanjiQuizMock } from "../../mocks/quiz.mock";

export default function QuizIntroPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state: { level: string; type: string };
  };

  return (
    <Card sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h4" mb={2}>
        {state.level} {state.type} Quiz
      </Typography>

      <Stack spacing={1} mb={3}>
        <Typography>Questions: {kanjiQuizMock.questions.length}</Typography>
        <Typography>Pass Score: {kanjiQuizMock.passScore}%</Typography>
      </Stack>

      {/* Optional progress */}
      <Box display="flex" justifyContent="center" my={3}>
        <ProgressCircle value={65} />
      </Box>

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/quiz/start")}
        >
          Start Quiz
        </Button>
      </Stack>
    </Card>
  );
}
