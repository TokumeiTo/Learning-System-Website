import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";
import * as React from "react";
import ListIcon from "@mui/icons-material/List";
import PageLayout from "../../components/layout/PageLayout";
import LessonMap from "../../components/lessons/LessonMap";
import LessonSidebar from "../../components/lessons/LessonSidebar/LessonSidebar";
import type { Lesson } from "../../types/lesson";
import { generateZigZagLayout } from "../../utils/lessonLayout";
import { lessonSidebarData, type CourseSidebarType, type LessonPlateType } from "../../mocks/lessonSidebar.mock";
import CourseProgressSidebar from "../../components/lessons/CourseProgressSidebar/CourseProgressSidebar";
import CalendarHeatmap from "../../components/chartAndProgress/DailyLessonChart";

export default function LessonPage() {
  const [selectedCourse, setSelectedCourse] = React.useState<string>("minnanonihongo");
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(true);
  const [activePlateId, setActivePlateId] = React.useState<number | null>(null);
  const theme = useTheme();

  const handleCourseChange = (e: SelectChangeEvent) => setSelectedCourse(e.target.value);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Extract all plates for map dynamically
  const lessons: Lesson[] = React.useMemo(() => {
    const course: CourseSidebarType | undefined = lessonSidebarData.find(
      (c) => c.course === selectedCourse
    );
    if (!course) return [];

    const allPlates: Lesson[] = [];
    course.levels.forEach((level) => {
      level.lessons.forEach((lessonItem) => {
        lessonItem.plates.forEach((plate: LessonPlateType) => {
          allPlates.push({
            id: plate.id,
            title: plate.title,
            completed: plate.completed,
            locked: plate.locked,
          });
        });
      });
    });
    return allPlates;
  }, [selectedCourse]);

  const positionedLessons = React.useMemo(
    () => generateZigZagLayout(lessons, { leftX: 50, rightX: 220, verticalGap: 120 }),
    [lessons]
  );

  return (
    <PageLayout>
      {/* Toolbar */}
      <Box sx={{
        display: "flex",
        position: "sticky",
        top: 90,
        mb: 3,
        justifyContent: 'space-between',
        alignItems: "center",
        gap: 2,
        bgcolor: theme.palette.background.paper,
        p: 2,
        borderRadius: 2,
        zIndex: 1,
        boxShadow: "-7px 0px 1px rgba(0, 255, 149, 0.48)",
        border: '1px solid rgba(0, 255, 149, 0.48)'
      }}>
        <FormControl variant="standard" sx={{ minWidth: 180, display: 'sticky', top: 0 }}>
          <InputLabel>Course</InputLabel>
          <Select value={selectedCourse} onChange={handleCourseChange}>
            {lessonSidebarData.map((c) => (
              <MenuItem key={c.course} value={c.course}>
                {c.course.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton onClick={toggleSidebar}>
          <ListIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row" }, // responsive
        }}
      >
        {/* Map */}
        <Box sx={{ flex: 1 }}>
          <LessonMap lessons={positionedLessons} activePlateId={activePlateId} />
        </Box>

        {/* Right side: Sidebar + Progress */}
        {sidebarOpen && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            {/* Progress Sidebar */}
            <CourseProgressSidebar progress={45} /> {/* Mock value 45% */}
            <LessonSidebar
              selectedCourse={selectedCourse}
              onSelectPlate={(_, __, ___, plateId) => setActivePlateId(plateId)}
            />
          </Box>
        )}
      </Box>


    </PageLayout>
  );
}
