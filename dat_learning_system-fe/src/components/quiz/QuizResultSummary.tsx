import {
  Card,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ReplayIcon from "@mui/icons-material/Replay";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

type Props = {
  score: number;
  passScore: number;
  onRetry?: () => void;
};

export default function QuizResultSummary({
  score,
  passScore,
  onRetry,
}: Props) {
  const passed = score >= passScore;

  return (
    <Card
      sx={{
        p: 5,
        maxWidth: 420,
        textAlign: "center",
        borderRadius: 4,
      }}
    >
      <Stack spacing={3} alignItems="center">
        {/* Result Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: passed ? "success.light" : "error.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {passed ? (
            <EmojiEventsIcon sx={{ fontSize: 40, color: "success.main" }} />
          ) : (
            <SentimentVeryDissatisfiedIcon
              sx={{ fontSize: 40, color: "error.main" }}
            />
          )}
        </Box>

        {/* Title */}
        <Typography variant="h5" fontWeight={600}>
          Quiz Completed
        </Typography>

        {/* Score */}
        <Typography variant="h4" fontWeight={700}>
          {score}%
        </Typography>

        {/* Status */}
        <Chip
          label={passed ? "PASSED" : "FAILED"}
          color={passed ? "success" : "error"}
          icon={
            passed ? (
              <SentimentVerySatisfiedIcon />
            ) : (
              <SentimentVeryDissatisfiedIcon />
            )
          }
          sx={{ fontWeight: 600 }}
        />

        {/* Message */}
        <Typography color="text.secondary">
          {passed
            ? "Excellent work! You're mastering these kanji."
            : "Don't worry! Practice makes perfect — try again."}
        </Typography>

        {/* Actions */}
        {onRetry && (
          <Button
            variant="contained"
            startIcon={<ReplayIcon />}
            onClick={onRetry}
            sx={{ mt: 1 }}
          >
            Retry Quiz
          </Button>
        )}
      </Stack>
    </Card>
  );
}
