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

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchClassroomData(id)
        .then((res) => {
          setData(res);
          if (res.lessons.length > 0 && !currentLesson) {
            setCurrentLesson(res.lessons[0]);
          }
        })
        .catch(err => console.error("Error loading classroom:", err))
        .finally(() => setLoading(false));
    }
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
            <ExitToAppIcon fontSize='medium' sx={{ mr: 1 }}/> Exit Classroom
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
              <LessonContentViewer contents={currentLesson?.contents || []} />
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