import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, CircularProgress, Button, Paper } from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { fetchClassroomData } from '../../api/classroom.api';
import type { ClassroomView, Lesson } from '../../types/classroom';

// NEW: Import useAuth
import { useAuth } from '../../hooks/useAuth';

import LessonContentSection from '../../components/classroom/LessonContentSection';
import LessonContentViewer from '../../components/classroom/LessonContentViewer';
import ClassroomSidebar from '../../components/classroom/ClassroomSidebar';

const ClassroomPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // NEW: Get user and check permissions
  const { user } = useAuth();
  const canEdit = user?.position === "Admin" || user?.position === "SuperAdmin";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ClassroomView | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  // Default to Viewer (false)
  const [isEditMode, setIsEditMode] = useState(false);


  const handleLessonComplete = (wasPassedFromQuiz: boolean = true) => {
    if (!currentLesson || !data || !wasPassedFromQuiz) return;

    // We only unlock/complete if the result was actually a 'Pass'
    const updatedLessons = data.lessons.map((lesson, index) => {
      if (lesson.id === currentLesson.id) {
        return { ...lesson, isDone: true };
      }

      const currentIndex = data.lessons.findIndex(l => l.id === currentLesson.id);
      if (index === currentIndex + 1) {
        return { ...lesson, isLocked: false };
      }
      return lesson;
    });

    setData({ ...data, lessons: updatedLessons });
    setCurrentLesson(prev => prev ? { ...prev, isDone: true } : null);
  };

  useEffect(() => {
    const loadClassroom = async () => {
      if (!id) return;
      try {
        setLoading(true); // ONLY set this for the initial course load
        const res = await fetchClassroomData(id);
        setData(res);

        // Initial lesson selection
        if (res.lessons.length > 0) {
          const resumeLesson = res.lessons.find(l => !l.isDone && !l.isLocked);
          setCurrentLesson(resumeLesson || res.lessons[0]);
        }
      } catch (err) {
        console.error("Error loading classroom:", err);
      } finally {
        setLoading(false);
      }
    };

    loadClassroom();
    // REMOVE currentLesson from here! 
    // We only want to reload if the classroom ID in the URL changes.
  }, [id]);

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f172a' }}>
      <CircularProgress />
    </Box>
  );

  if (!data) return <Typography color="white">Course Not Found</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', color: 'white', p: { xs: 2, md: 4 } }}>

      {/* Top Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={900}>{data.courseTitle}</Typography>
          <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 700 }}>
            {currentLesson?.title || 'Overview'}
          </Typography>
          {isEditMode && (
            <Typography
              variant="button"
              sx={{ color: 'warning.main', fontWeight: 'bold', ml: 2 }}
            >
              ● Editing Mode
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">

          {/* --- CONDITIONALLY RENDER TOGGLE --- */}
          {canEdit && (
            <Stack direction="row" sx={{ bgcolor: '#1e293b', p: 0.5, borderRadius: 2 }}>
              <Button
                size="small"
                onClick={() => setIsEditMode(false)}
                startIcon={<Visibility />}
                sx={{
                  color: !isEditMode ? 'white' : 'rgba(255,255,255,0.4)',
                  bgcolor: !isEditMode ? '#6366f1' : 'transparent',
                  '&:hover': { bgcolor: !isEditMode ? '#4f46e5' : 'rgba(255,255,255,0.05)' },
                  borderRadius: 1.5, textTransform: 'none', px: 2
                }}
              >
                Preview
              </Button>
              <Button
                size="small"
                onClick={() => setIsEditMode(true)}
                startIcon={<Edit />}
                sx={{
                  color: isEditMode ? 'white' : 'rgba(255,255,255,0.4)',
                  bgcolor: isEditMode ? '#6366f1' : 'transparent',
                  '&:hover': { bgcolor: isEditMode ? '#4f46e5' : 'rgba(255,255,255,0.05)' },
                  borderRadius: 1.5, textTransform: 'none', px: 2
                }}
              >
                Edit
              </Button>
            </Stack>
          )}

          <Button
            variant="outlined"
            onClick={() => navigate('/courses')}
            sx={{ color: '#405d8b', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <ExitToAppIcon fontSize='medium' sx={{ mr: 1 }} /> Exit Classroom
          </Button>
        </Stack>
      </Stack>

      {/* Main Layout Grid */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>

        {/* Left: Content Renderer */}
        <Box sx={{ flex: 2, width: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: (isEditMode && canEdit) ? 'transparent' : '#1e293b',
              borderRadius: 3,
              border: (isEditMode && canEdit) ? 'none' : '1px solid rgba(255,255,255,0.05)'
            }}
          >
            {/* Double-check canEdit here just to be safe */}
            {(isEditMode && canEdit) ? (
              <LessonContentSection currentLesson={currentLesson} />
            ) : (
              <LessonContentViewer
                contents={currentLesson?.contents || []}
                lessonId={currentLesson?.id}
                isDone={currentLesson?.isDone}
                onComplete={handleLessonComplete}
              />
            )}
          </Paper>
        </Box>

        {/* Right: Sidebar */}
        <Box sx={{ flex: 1, width: '100%' }}>
          <ClassroomSidebar
            data={data}
            setData={setData}
            currentLesson={currentLesson}
            setCurrentLesson={setCurrentLesson}
            isEditMode={isEditMode && canEdit} // Ensure sidebar knows if edit is restricted
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ClassroomPage;