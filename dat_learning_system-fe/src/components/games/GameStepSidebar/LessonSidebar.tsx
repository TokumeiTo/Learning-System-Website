import { Box, Typography } from "@mui/material";
import { lessonSidebarData } from "../../../mocks/lessonSidebar.mock";
import type { LessonSidebarProps } from "../../../types/lessonSidebar";
import { useLessonSidebar } from "./useLessonSidebar";
import LevelItem from "./LevelItem";
import { useMemo } from "react";

export default function LessonSidebar({
  selectedCourse,
  activePlateId,
  onSelectPlate,
}: LessonSidebarProps) {
  const { openLevels, openLessons, toggleLevel, toggleLesson } = useLessonSidebar();

  const courseItem = useMemo(
    () => lessonSidebarData.find((c) => c.course === selectedCourse),
    [selectedCourse]
  );

  if (!courseItem) return null;

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "background.blur",
        boxShadow: "0px 0px 5px rgba(0,132,255,1)",
        borderRadius: 2,
        overflowY: "auto",
        height: "100%",
        zIndex: 5,
      }}
    >
      <Box sx={{ position: "sticky", top: -17 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            bgcolor: "background.blur",
            zIndex: 2,
            borderBottom: "1px solid rgba(0,132,255,0.3)",
            p: 2,
          }}
        >
          {courseItem.course.toUpperCase()}
        </Typography>

        {courseItem.levels.map((level) => {
          const levelKey = `${courseItem.course}-${level.id}`;

          return (
            <LevelItem
              key={levelKey}
              levelKey={levelKey}
              level={level}
              isOpen={openLevels[levelKey]}
              toggleLevel={toggleLevel}
              openLessons={openLessons}
              toggleLesson={toggleLesson}
              activePlateId={activePlateId}
              onSelectPlate={(lessonTitle, plateId) =>
                onSelectPlate(courseItem.course, level.title, lessonTitle, plateId)
              }
            />
          );
        })}

      </Box>
    </Box>
  );
}
