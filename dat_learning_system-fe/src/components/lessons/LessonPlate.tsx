import { Box, Paper, Typography, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import LockIcon from "@mui/icons-material/Lock";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import LocalLibraryTwoToneIcon from '@mui/icons-material/LocalLibraryTwoTone';
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

type Props = {
  completed: boolean;
  locked: boolean;
  active?: boolean;
  title: string;
  description?: string;
  onClick?: () => void;
};

export default function LessonPlate({
  completed,
  locked,
  active,
  title,
  description,
  onClick,
}: Props) {
  const theme = useTheme();
  const [animateUnlock, setAnimateUnlock] = useState(false);
  const [prevLocked, setPrevLocked] = useState(locked);

  // 🔓 Unlock animation
  useEffect(() => {
    if (prevLocked && !locked) {
      setAnimateUnlock(true);
      setTimeout(() => setAnimateUnlock(false), 600);
    }
    setPrevLocked(locked);
  }, [locked, prevLocked]);

  const handleClick = () => {
    if (locked) return;
    onClick?.();
  };

  return (
    <Tooltip title={locked ? "Complete previous lesson" : description ? description : ""}>
      <Box
        sx={{
          position: "relative",
          width: 80,
          height: 80,
          cursor: locked ? "not-allowed" : "pointer",
        }}
      >
        {/* BODY (DEPTH) */}
        <Box
          sx={{
            position: "absolute",
            top: 6,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            bgcolor: completed
              ? "#00b309ff"
              : locked
                ? theme.palette.grey[800]
                : theme.palette.primary.dark,
            boxShadow: completed
              ? "0 4px 10px rgba(34,204,0,1)"
              : locked
                ? "0 4px 10px rgba(100,100,100,0.6)"
                : "0 4px 10px rgba(0,128,255,0.6)",
          }}
        />

        {/* TOP PLATE */}
        <Paper
          onClick={handleClick}
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            bgcolor: completed
              ? "#00ff0dff"
              : locked
                ? theme.palette.grey[600]
                : theme.palette.primary.main,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            boxShadow: `
              inset 0 2px 0 rgba(60,255,0,0.4),
              inset 0 -2px 0 rgba(0,0,0,0.15)
            `,

            animation: animateUnlock
              ? "unlockPop 0.6s ease-out"
              : active
                ? "activePulse 1.4s ease-in-out infinite"
                : "none",

            "@keyframes unlockPop": {
              "0%": { transform: "scale(0.8)" },
              "60%": {
                transform: "scale(1.15)",
                boxShadow: `0 0 25px ${theme.palette.primary.main}`,
              },
              "100%": { transform: "scale(1)" },
            },

            "@keyframes activePulse": {
              "0%": { boxShadow: `0 0 0 ${theme.palette.primary.main}` },
              "50%": { boxShadow: `0 0 20px ${theme.palette.primary.main}` },
              "100%": { boxShadow: `0 0 0 ${theme.palette.primary.main}` },
            },

            transition: "transform 0.15s ease",

            "&:hover": locked ? {} : { transform: "translateY(-3px)" },
            "&:active": locked ? {} : { transform: "translateY(3px)" },
          }}
        >
          {completed && <CheckIcon sx={{ color: "#fff", fontSize: 32 }} />}
          {!locked && !completed && title.includes("Review") && (
            <FactCheckIcon sx={{ color: "#fff", fontSize: 32 }} />
          )}
          {!locked && !completed && title.includes("Katakana") && (
            <Typography sx={{ color: "#fff", fontSize: 32, cursor: 'pointer', userSelect: 'none' }}>ア</Typography>
          )}
          {!locked && !completed && title.includes("Hiragana") && (
            <Typography sx={{ color: "#fff", fontSize: 32, cursor: 'pointer', userSelect: 'none' }}>あ</Typography>
          )}
          {!locked && !completed && title.includes("Grammar") && (
            <SpellcheckIcon sx={{ color: "#fff", fontSize: 32 }} />
          )}
          {!locked && !completed && title.includes("Reading") && (
            <LocalLibraryTwoToneIcon sx={{ color: "#fff", fontSize: 32 }} />
          )}
          {locked && <LockIcon sx={{ color: "#fff", fontSize: 32 }} />}
        </Paper>
      </Box>
    </Tooltip>
  );
}
