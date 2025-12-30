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
import { LessonMap } from "../../components/lessons";
import LessonSidebar from "../../components/lessons/LessonSidebar";
import type { Lesson } from "../../types/lesson";
import { generateZigZagLayout } from "../../utils/lessonLayout";
import { lessonSidebarData, type CourseSidebarType, type LessonPlateType } from "../../mocks/lessonSidebar.mock";

export default function LessonPage() {
  const [selectedCourse, setSelectedCourse] = React.useState<string>("minna");
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
      <Box sx={{ display: "flex", mb: 3, justifyContent: 'space-between', alignItems: "center", gap: 2, bgcolor: theme.palette.background.paper, p: 2, borderRadius: 2 }}>
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

      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Map */}
        <Box sx={{ flex: 1 }}>
          <LessonMap
            lessons={positionedLessons}
            activePlateId={activePlateId}
          />

        </Box>

        {/* Sidebar */}
        {sidebarOpen && (
          <Box sx={{ width: 280 }}>
            <LessonSidebar
              selectedCourse={selectedCourse}
              onSelectPlate={(_, __, ___, plateId) => {
                setActivePlateId(plateId);
              }}
            />
          </Box>
        )}
      </Box>
    </PageLayout>
  );
}
