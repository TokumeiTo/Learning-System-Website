// LessonMap.tsx
import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LessonPlate from "./LessonPlate";
import { generateSnakePath } from "../../utils/lessonPath";
import type { PositionedLesson } from "../../utils/lessonLayout";

type Props = {
  lessons: PositionedLesson[];
  activePlateId?: number | null;
  onPlateClick?: (lessonId: number) => void;
};

export default function LessonMap({
  lessons,
  activePlateId,
  onPlateClick,
}: Props) {
  const theme = useTheme();

  // 🔥 Dynamic map height (Step 2)
  const mapHeight = React.useMemo(() => {
    if (lessons.length === 0) return 600;
    const maxY = Math.max(...lessons.map((l) => l.y));
    return maxY + 160;
  }, [lessons]);

  // 🔥 Auto-scroll to active plate (Step 1)
  useEffect(() => {
    if (!activePlateId) return;

    const el = document.getElementById(`plate-${activePlateId}`);
    el?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activePlateId]);

  const path = generateSnakePath(lessons);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: mapHeight,
      }}
    >
      {/* 🔗 PATH */}
      <Box sx={{display: {xs:'none', md:'block'}}}>
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
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
        </svg>
      </Box>

      {/* 🧩 PLATES */}
      {lessons.map((lesson) => (
        <Box
          key={lesson.id}
          id={`plate-${lesson.id}`}
          sx={{
            position: "absolute",
            top: lesson.y,
            left: { md: lesson.x, xs: `calc(${lesson.x}px + 15%)` },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <LessonPlate
            completed={lesson.completed}
            locked={lesson.locked}
            active={lesson.id === activePlateId}
            title={lesson.title}
            description={lesson.description}
            onClick={() => onPlateClick?.(lesson.id)}
          />

          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              textAlign: "center",
              maxWidth: 90,
            }}
          >
            {lesson.title}
          </Typography>
        </Box>
      ))
      }
    </Box >
  );
}
