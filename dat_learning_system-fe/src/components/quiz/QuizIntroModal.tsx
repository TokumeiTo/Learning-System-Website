import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuizIcon from "@mui/icons-material/Quiz";
import TimerIcon from "@mui/icons-material/Timer";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import QuizTwoToneIcon from '@mui/icons-material/QuizTwoTone';
import SettingsIcon from '@mui/icons-material/Settings';

import { useNavigate } from "react-router-dom";
import { startJlptQuizSession } from "../../api/jlpt_quiz.api";
import type { JlptTestDto } from "../../types_interfaces/jlptquiz";
import { useAuth } from "../../hooks/useAuth";
import AdminAddQuestion from "./AdminAddQuestion";

interface QuizIntroModalProps {
  test: JlptTestDto;
  onClose: () => void;
}

// Reusable styles
const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  bgcolor: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1300,
  backdropFilter: "blur(6px)",
};

const modalCardStyle = {
  width: { xs: "95%", sm: 600, md: 700 },
  p: 4,
  position: "relative",
  borderRadius: 4,
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  bgcolor: "background.paper",
  maxHeight: '90vh',
  overflowY: 'auto',
};

export default function QuizIntroModal({ test, onClose }: QuizIntroModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const canManageCourses = user?.position === "Admin" || user?.position === "SuperAdmin";

  // VIEW 1: ADMIN QUESTION CREATOR
  if (isAdminMode && canManageCourses) {
    return (
      <Box sx={modalOverlayStyle}>
        <Card sx={modalCardStyle}>
          <Button 
            startIcon={<span>←</span>} 
            onClick={() => setIsAdminMode(false)} 
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Back to Quiz Intro
          </Button>
          <Divider sx={{ mb: 3 }} />
          
          {/* This is where the magic happens */}
          <AdminAddQuestion testId={test.id} />
        </Card>
      </Box>
    );
  }

  // VIEW 2: STANDARD STUDENT INTRO
  const handleStart = async () => {
    if (test.questionCount === 0) return; // Don't start empty tests
    setIsStarting(true);
    try {
      const sessionId = await startJlptQuizSession(test.id);
      navigate("/quiz/start", {
        state: {
          testId: test.id,
          sessionId: sessionId,
          title: test.title,
          level: test.jlptLevel,
          category: test.category
        },
      });
      onClose();
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Box sx={modalOverlayStyle}>
      <Card sx={modalCardStyle}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 12, right: 12 }}
          disabled={isStarting}
        >
          <CloseIcon />
        </IconButton>

        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <QuizIcon color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h5" fontWeight={700}>{test.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {test.jlptLevel} • {test.category}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2.5}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <QuizTwoToneIcon color={test.questionCount > 0 ? "success" : "error"} />
            <Typography variant="body1">
              <strong>{test.questionCount}</strong> Questions
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <TimerIcon color="warning" />
            <Typography variant="body1">
              Estimated Time: <strong>~{Math.ceil(test.questionCount * 1.5)}</strong> minutes
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <TipsAndUpdatesIcon color="info" />
            <Typography variant="body1">
              Passing Grade: <strong>{test.passingGrade}%</strong>
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button fullWidth variant="outlined" onClick={onClose} disabled={isStarting}>
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleStart}
            disabled={isStarting || test.questionCount === 0}
            startIcon={isStarting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {test.questionCount === 0 ? "Empty Test" : isStarting ? "Initializing..." : "Begin Test"}
          </Button>
        </Box>

        {/* ADMIN ACTION */}
        {canManageCourses && (
          <Button
            fullWidth
            variant="text"
            color="secondary"
            startIcon={<SettingsIcon />}
            sx={{ mt: 2 }}
            onClick={() => setIsAdminMode(true)}
          >
            Manage Quiz Questions
          </Button>
        )}
      </Card>
    </Box>
  );
}