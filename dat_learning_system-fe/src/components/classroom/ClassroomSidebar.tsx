import { memo, useCallback, useEffect, useState } from 'react';
import { Paper, Tabs, Tab, Box, Typography, Fade } from '@mui/material';
import type { ClassroomView, CourseStudent } from '../../types_interfaces/classroom';
import CurriculumTab from './CurriculumTab';
import ClassworkTab from './ClassworkTab';
import { fetchEnrolledStudents } from '../../api/classroom.api';
import StudentListTab from './StudentListTab';

interface Props {
  data: ClassroomView;
  setData: React.Dispatch<React.SetStateAction<ClassroomView | null>>;
  currentLessonId: string | null;
  setCurrentLessonId: (id: string) => void;
  isEditMode: boolean;
  onStudentSelect: (userId: string) => void;
}

const ClassroomSidebar = memo(({
  data,
  setData,
  currentLessonId,
  setCurrentLessonId,
  isEditMode,
  onStudentSelect
}: Props) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleLessonChange = useCallback((lessonId: string) => {
    if (lessonId === currentLessonId) return;

    const targetLesson = data.lessons.find(l => l.id === lessonId);

    if (!targetLesson) return;

    // Logic check: Only allow if not locked OR if user is an Admin in Edit Mode
    if (targetLesson.isLocked && !isEditMode) {
      console.warn("This lesson is locked. Complete previous lessons first.");
      return;
    }

    setCurrentLessonId(lessonId);
  }, [currentLessonId, data.lessons, isEditMode, setCurrentLessonId]);

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#1e293b',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)',
        height: 'fit-content',
        position: 'sticky',
        top: 24,
        minWidth: { lg: 350 }
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="inherit"
        sx={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.4)',
            '&.Mui-selected': { color: '#818cf8' }
          }
        }}
      >
        <Tab label="Curriculum" />
        <Tab label="Classwork" />
        <Tab label="Students" />
      </Tabs>

      <Box sx={{ p: 1, minHeight: 400 }}>
        {/* Tab Panel: Curriculum */}
        {activeTab === 0 && (
          <Fade in={activeTab === 0} timeout={300}>
            <Box>
              <CurriculumTab
                data={data}
                setData={setData}
                currentLessonId={currentLessonId}
                onLessonSelect={handleLessonChange}
                isEditMode={isEditMode}
              />
            </Box>
          </Fade>
        )}

        {/* Tab Panel: Classwork */}
        {activeTab === 1 && (
          <Fade in={activeTab === 1}>
            <Box>
              <ClassworkTab
                courseId={data.courseId}
                isEditMode={isEditMode}
              />
            </Box>
          </Fade>
        )}

        {/* Tab Panel: Students' Review */}
        {activeTab === 2 && (
          <Fade in={activeTab === 2}>
            <Box sx={{ p: 1 }}>
              <StudentListTab courseId={data.courseId} onSelect={onStudentSelect} />
            </Box>
          </Fade>
        )}
      </Box>
    </Paper>
  );
});

export default ClassroomSidebar;