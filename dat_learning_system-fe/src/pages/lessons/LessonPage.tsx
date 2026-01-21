import React from "react";
import { Box, IconButton, FormControl, InputLabel, Select, MenuItem, useTheme, useMediaQuery } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import GradingTwoToneIcon from "@mui/icons-material/GradingTwoTone";

import PageLayout from "../../components/layout/PageLayout";
import LessonMap from "../../components/lessons/LessonMap";
import LessonSidebar from "../../components/lessons/LessonSidebar/LessonSidebar";
import CourseProgressSidebar from "../../components/lessons/CourseProgressSidebar/CourseProgressSidebar";

import { generateZigZagLayout } from "../../utils/lessonLayout";
import { lessonSidebarData, type PlateInfo } from "../../mocks/lessonSidebar.mock";
import type { Lesson } from "../../types/lesson";
import { lessonToPlateInfo } from "../../utils/lessonToPlateInfo";
import type { SelectChangeEvent } from "@mui/material";

export default function LessonPage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // xs/md

  const [selectedCourse, setSelectedCourse] = React.useState("minnanonihongo");

  const [leftSidebarOpen, setLeftSidebarOpen] = React.useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = React.useState(true);

  const [selectedPlate, setSelectedPlate] = React.useState<PlateInfo | undefined>(undefined);

  // Handle course change
  const handleCourseChange = (e: SelectChangeEvent) => setSelectedCourse(e.target.value);

  // Toggle left sidebar
  const toggleLeftSidebar = () => {
    if (isSmallScreen && !leftSidebarOpen) setRightSidebarOpen(false);
    setLeftSidebarOpen((prev) => !prev);
  };

  // Toggle right sidebar
  const toggleRightSidebar = () => {
    if (isSmallScreen && !rightSidebarOpen) setLeftSidebarOpen(false);
    setRightSidebarOpen((prev) => !prev);
  };

  // Extract all plates for map
  const lessons = React.useMemo<Lesson[]>(() => {
    const course = lessonSidebarData.find((c) => c.course === selectedCourse);
    if (!course) return [];

    const allPlates: Lesson[] = [];
    course.levels.forEach((level) => {
      level.lessons.forEach((lessonItem) => {
        lessonItem.plates.forEach((plate) => {
          allPlates.push({
            id: plate.id,
            title: plate.title,
            description: plate.description,
            completed: plate.completed,
            locked: plate.locked,
            isTest: plate.isTest,
            correct: plate.correct,
            wrong: plate.wrong,
          });
        });
      });
    });
    return allPlates;
  }, [selectedCourse]);

  // Generate positions for the map
  const positionedLessons = React.useMemo(
    () => generateZigZagLayout(lessons, { leftX: 50, rightX: 220, verticalGap: 120 }),
    [lessons]
  );

  return (
    <PageLayout>
      <Box p={3} pt={0}>
        {/* Toolbar */}
        <Box
          sx={{
            display: "flex",
            position: "sticky",
            top: 100,
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            bgcolor: theme.palette.background.blur,
            p: 2,
            borderRadius: 2,
            zIndex: 3,
            boxShadow: "-7px 0px 1px rgba(0, 255, 149, 0.48)",
            border: "1px solid rgba(0, 255, 149, 0.48)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {/* Left Sidebar Toggle */}
          <IconButton onClick={toggleLeftSidebar}>
            <ListIcon sx={{
              color: leftSidebarOpen
                ? theme.palette.text.tertiary
                : "inherit",
            }} />
          </IconButton>

          {/* Course Select */}
          <FormControl variant="standard" sx={{ minWidth: 180 }}>
            <InputLabel>Course</InputLabel>
            <Select value={selectedCourse} onChange={handleCourseChange}>
              {lessonSidebarData.map((c) => (
                <MenuItem key={c.course} value={c.course}>
                  {c.course.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Right Sidebar Toggle */}
          <IconButton onClick={toggleRightSidebar}>
            <GradingTwoToneIcon sx={{
              color: rightSidebarOpen
                ? theme.palette.text.tertiary
                : "inherit",
            }} />
          </IconButton>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: "flex", flexWrap: 'wrap', gap: 2 }}>
          {/* Left Sidebar */}
          <Box
            sx={{
              position: { xs: "fixed", md: "sticky" },
              display: leftSidebarOpen? "block": "none",
              top: 200,
              minWidth: { xs: "calc(100% - 110px)", md: "300px", lg: "400px" },
              height: "calc(100vh - 250px)",
              zIndex: 2,
              transform: {
                xs: leftSidebarOpen ? "translateY(0)" : "translateY(120%)",
                md: "none",
              },
              opacity: {
                xs: leftSidebarOpen ? 1 : 0,
                md: 1,
              },
              transition: "transform 0.35s ease, opacity 0.2s ease",
              pointerEvents: leftSidebarOpen ? "auto" : "none",
            }}
          >
            <LessonSidebar
              selectedCourse={selectedCourse}
              activePlateId={selectedPlate?.id}
              onSelectPlate={(_, __, ___, plateId) => {
                const plate = positionedLessons.find((l) => l.id === plateId);
                if (!plate) return;

                setSelectedPlate(lessonToPlateInfo(plate));

                // Close sidebar only on mobile
                if (isSmallScreen) setLeftSidebarOpen(false);
              }}
            />
          </Box>

          {/* Lesson Map */}
          <Box sx={{ flex: 1 }}>
            <LessonMap
              lessons={positionedLessons}
              activePlateId={selectedPlate?.id ?? null}
              onPlateClick={(plateId) => {
                const lesson = positionedLessons.find((l) => l.id === plateId);
                if (!lesson) return;
                setSelectedPlate(lessonToPlateInfo(lesson));
              }}
            />
          </Box>

          {/* Right Sidebar */}
          <Box>
            {rightSidebarOpen && <CourseProgressSidebar progress={45} selectedPlate={selectedPlate} />}
          </Box>
        </Box>
      </Box>
    </PageLayout>
  );
}
