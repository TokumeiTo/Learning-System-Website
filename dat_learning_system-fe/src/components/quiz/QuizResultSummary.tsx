import { Card, Typography, Button } from "@mui/material";

type Props = {
  score: number;
  passScore: number;
  onRetry?: () => void;
};

export default function QuizResultSummary({ score, passScore, onRetry }: Props) {
  const passed = score >= passScore;

  return (
    <Card sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5">Quiz Result</Typography>
      <Typography sx={{ mt: 2 }}>Score: {score}%</Typography>
      <Typography color={passed ? "green" : "red"} sx={{ mt: 1 }}>
        {passed ? "Passed 🎉" : "Failed ❌"}
      </Typography>
      {onRetry && (
        <Button sx={{ mt: 3 }} variant="contained" onClick={onRetry}>
          Retry Quiz
        </Button>
      )}
    </Card>
  );
}
