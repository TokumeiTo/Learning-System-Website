import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, CircularProgress, Button, Paper } from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { fetchClassroomData } from '../../api/classroom.api';
import type { ClassroomView } from '../../types/classroom';
import { useAuth } from '../../hooks/useAuth';

import LessonContentSection from '../../components/classroom/LessonContentSection';
import LessonContentViewer from '../../components/classroom/LessonContentViewer';
import ClassroomSidebar from '../../components/classroom/ClassroomSidebar';

const ClassroomPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Permissions
  const canEdit = user?.position === "Admin" || user?.position === "SuperAdmin";

  // State
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ClassroomView | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  /**
   * Derived State: Always find the current lesson from the fresh data array.
   * This prevents "stale data" bugs when the sidebar updates lesson titles or status.
   */
  const currentLesson = data?.lessons.find((l) => l.id === currentLessonId) || null;

  /**
   * Load Data: 
   * @param isSilent - If true, reloads data in background (useful for Manual Sync updates)
   */
  const loadClassroom = useCallback(async (isSilent: boolean = false) => {
    if (!id) return;
    try {
      if (!isSilent) setLoading(true);
      const res = await fetchClassroomData(id);
      setData(res);

      // Set initial lesson only if one isn't already selected
      if (res.lessons.length > 0 && !currentLessonId) {
        const resumeLesson = res.lessons.find((l) => !l.isDone && !l.isLocked);
        setCurrentLessonId(resumeLesson?.id || res.lessons[0].id);
      }
    } catch (err) {
      console.error("Error loading classroom:", err);
    } finally {
      setLoading(false);
    }
  }, [id, currentLessonId]);

  useEffect(() => {
    loadClassroom();
  }, [id]); // Only re-run when the course ID changes

  /**
   * Local state update for immediate UI feedback when a student passes a quiz
   */
  const handleLessonComplete = (wasPassedFromQuiz: boolean = true, newScore?: number) => {
    if (!currentLesson || !data || !wasPassedFromQuiz) return;

    const updatedLessons = data.lessons.map((lesson, index) => {
      if (lesson.id === currentLesson.id) {
        return { ...lesson, isDone: true, lastScore: newScore ?? lesson.lastScore };
      }
      const currentIndex = data.lessons.findIndex((l) => l.id === currentLesson.id);
      if (index === currentIndex + 1) {
        return { ...lesson, isLocked: false };
      }
      return lesson;
    });

    setData({ ...data, lessons: updatedLessons });
  };

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f172a' }}>
      <CircularProgress />
    </Box>
  );

  if (!data) return <Typography color="white" sx={{ p: 4 }}>Course Not Found</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', color: 'white', p: { xs: 2, md: 4 } }}>

      {/* Top Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={900}>{data.courseTitle}</Typography>
          <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 700 }}>
            {currentLesson?.title || 'Overview'}
          </Typography>
          {isEditMode && canEdit && (
            <Typography variant="button" sx={{ color: 'warning.main', fontWeight: 'bold', ml: 2 }}>
              ● Editing Mode
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          {canEdit && (
            <Stack direction="row" sx={{ bgcolor: '#1e293b', p: 0.5, borderRadius: 2 }}>
              <Button
                size="small"
                onClick={() => setIsEditMode(false)}
                startIcon={<Visibility />}
                sx={{
                  color: !isEditMode ? 'white' : 'rgba(255,255,255,0.4)',
                  bgcolor: !isEditMode ? '#6366f1' : 'transparent',
                  borderRadius: 1.5, textTransform: 'none', px: 2,
                  '&:hover': { bgcolor: !isEditMode ? '#4f46e5' : 'rgba(255,255,255,0.05)' }
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
                  borderRadius: 1.5, textTransform: 'none', px: 2,
                  '&:hover': { bgcolor: isEditMode ? '#4f46e5' : 'rgba(255,255,255,0.05)' }
                }}
              >
                Edit
              </Button>
            </Stack>
          )}

          <Button
            variant="outlined"
            onClick={() => navigate('/courses')}
            startIcon={<ExitToAppIcon />}
            sx={{ color: '#405d8b', borderColor: 'rgba(255,255,255,0.2)', textTransform: 'none' }}
          >
            Exit Classroom
          </Button>
        </Stack>
      </Stack>

      {/* Main Layout Grid */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>

        {/* Left: Content Area (Renderer or Editor) */}
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
            {(isEditMode && canEdit) ? (
              <LessonContentSection
                currentLesson={currentLesson}
                onSaveSuccess={() => loadClassroom(true)} // Trigger background refresh to get new IDs
              />
            ) : (
              <LessonContentViewer
                contents={currentLesson?.contents || []}
                lessonId={currentLesson?.id}
                isDone={currentLesson?.isDone}
                lastScore={currentLesson?.lastScore}
                onComplete={handleLessonComplete}
              />
            )}
          </Paper>
        </Box>

        {/* Right: Sidebar Navigation */}
        <Box sx={{ flex: 1, width: '100%' }}>
          <ClassroomSidebar
            data={data}
            setData={setData}
            currentLessonId={currentLessonId}
            setCurrentLessonId={setCurrentLessonId}
            isEditMode={isEditMode && canEdit}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ClassroomPage;