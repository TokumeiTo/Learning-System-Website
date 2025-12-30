import { Box, Paper, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import LockIcon from "@mui/icons-material/Lock";
import { useTheme } from "@mui/material/styles";

type Lesson = {
  id: number;
  title: string;
  completed: boolean;
  locked: boolean;
  x: number;
  y: number;
};

const lessons: Lesson[] = [
  { id: 1, title: "Hiragana 1", completed: true, locked: false, x: 50, y: 50 },
  { id: 2, title: "Hiragana 2", completed: false, locked: false, x: 200, y: 120 },
  { id: 3, title: "Katakana 1", completed: false, locked: true, x: 80, y: 250 },
  { id: 4, title: "Kanji Basics", completed: false, locked: true, x: 220, y: 380 },
  { id: 5, title: "Kanji Advanced", completed: false, locked: true, x: 50, y: 500 },
];

// Helper to create snake-like curve segments
const generateSnakePath = (lessons: Lesson[]) => {
  let d = `M${lessons[0].x + 40} ${lessons[0].y + 40}`;
  for (let i = 1; i < lessons.length; i++) {
    const prev = lessons[i - 1];
    const curr = lessons[i];
    const midX = (prev.x + curr.x) / 2 + (Math.random() * 40 - 20);
    const midY = (prev.y + curr.y) / 2 + (Math.random() * 40 - 20);
    d += ` Q${midX} ${midY}, ${curr.x + 40} ${curr.y + 40}`;
  }
  return d;
};

export default function LessonPage() {
  const theme = useTheme();
  const path = generateSnakePath(lessons);

  return (
    <Box sx={{ p: 4, position: "relative", width: "100%", height: 600 }}>
      {/* Snake-like dashed path */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path
          d={path}
          stroke={theme.palette.primary.main}
          strokeWidth={4}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray="8 6"
        />
      </svg>

      {/* Nodes with proper labels */}
      {lessons.map((lesson) => (
        <Box
          key={lesson.id}
          sx={{
            position: "absolute",
            top: lesson.y,
            left: lesson.x,
            textAlign: "center",
          }}
        >
          <Paper
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: lesson.completed
                ? theme.palette.primary.main
                : lesson.locked
                ? theme.palette.grey[800]
                : theme.palette.background.paper,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: lesson.completed
                ? "0 0 25px rgba(61,167,253,0.7)"
                : 3,
              cursor: lesson.locked ? "not-allowed" : "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: lesson.locked ? "none" : "scale(1.1)",
                boxShadow: lesson.locked
                  ? "none"
                  : "0 0 30px rgba(61,167,253,0.7)",
              },
            }}
          >
            {lesson.completed && <CheckIcon sx={{ color: "#fff" }} />}
            {lesson.locked && <LockIcon sx={{ color: "#fff" }} />}
          </Paper>

          {/* Always visible label */}
          <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 500 }}>
            {lesson.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
