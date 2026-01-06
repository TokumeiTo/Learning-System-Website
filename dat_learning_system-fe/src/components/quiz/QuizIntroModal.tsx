import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuizIcon from "@mui/icons-material/Quiz";
import TimerIcon from "@mui/icons-material/Timer";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import QuizTwoToneIcon from '@mui/icons-material/QuizTwoTone';

import { kanjiQuizMock } from "../../mocks/quiz.mock";
import { useNavigate } from "react-router-dom";

interface QuizIntroModalProps {
  level: string;
  type: string;
  test: {
    id: number;
    title: string;
    condition: string;
  };
  onClose: () => void;
}


export default function QuizIntroModal({ level, type, test, onClose }: QuizIntroModalProps) {

  const navigate = useNavigate();

  const handleStart = () => {
    onClose(); // close modal first (clean UX)

    navigate("/quiz/start", {
      state: {
        level,
        type,
        testId: test.id,
        title: test.title,
      },
    });
  };
  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
        backdropFilter: "blur(4px)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1529692236671-fc8f2aebc0d1?auto=format&fit=crop&w=800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          zIndex: -1,
        },
      }}
    >
      <Card
        sx={{
          width: { xs: "90%", sm: 600, md: 700 },
          p: 4,
          position: "relative",
          borderRadius: 3,
          boxShadow: 24,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "hidden",
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Title */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <QuizIcon color="primary" />
          <Typography variant="h4" fontWeight={600}>
            {level} {type} Quiz
          </Typography>
        </Stack>

        <Divider />

        {/* Quiz details with icons */}
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <QuizTwoToneIcon color="success" />
            <Typography>Total Questions: {kanjiQuizMock.questions.length}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TimerIcon color="warning" />
            <Typography>Estimated Time: ~{kanjiQuizMock.questions.length * 1.5} mins</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TipsAndUpdatesIcon color="info" />
            <Typography>Pass Score: {kanjiQuizMock.passScore}%</Typography>
          </Stack>
          <Typography color="text.secondary" fontStyle="italic">
            Tip: Read each question carefully and try not to rush.
          </Typography>
        </Stack>

        {/* Buttons */}
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStart}
            sx={{
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
            }}
          >
            Start Quiz
          </Button>
        </Stack>

        {/* Motivational footer */}
        <Typography
          variant="caption"
          color="text.secondary"
          mt={2}
          textAlign="center"
        >
          🌸 Good luck! Make sure your device is fully charged and you are in a quiet environment.
        </Typography>
      </Card>
    </Box>
  );
}
