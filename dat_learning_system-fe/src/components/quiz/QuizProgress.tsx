import { LinearProgress, Typography, Box } from "@mui/material";

type Props = {
  current: number;
  total: number;
};

export default function QuizProgress({ current, total }: Props) {
  const percentage = (current / total) * 100;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography>
        Question {current} of {total}
      </Typography>
      <LinearProgress variant="determinate" value={percentage} sx={{ height: 10, borderRadius: 5 }} />
    </Box>
  );
}
