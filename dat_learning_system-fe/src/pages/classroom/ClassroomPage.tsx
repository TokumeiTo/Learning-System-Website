import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, CircularProgress, Button, Paper } from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { fetchClassroomData } from '../../api/classroom.api';
import type { ClassroomView, Lesson } from '../../types/classroom';

import LessonContentSection from '../../components/classroom/LessonContentSection';
import LessonContentViewer from '../../components/classroom/LessonContentViewer';
import ClassroomSidebar from '../../components/classroom/ClassroomSidebar';

const ClassroomPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ClassroomView | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  // New State: Toggle between Builder (Edit) and Viewer (Read)
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchClassroomData(id)
        .then((res) => {
          setData(res);
          // Auto-select first lesson if none selected
          if (res.lessons.length > 0 && !currentLesson) {
            setCurrentLesson(res.lessons[0]);
          }
        })
        .catch(err => console.error("Error loading classroom:", err))
        .finally(() => setLoading(false));
    }
    // Removed currentLesson from dependencies to avoid re-fetching on selection
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

        {/* --- TOGGLE CONTROLS --- */}
        <Stack direction="row" spacing={2} alignItems="center">
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

          <Button
            variant="outlined"
            onClick={() => navigate('/courses')}
            sx={{ color: '#405d8b', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <ExitToAppIcon fontSize='medium'/>Exit Classroom
          </Button>
        </Stack>
      </Stack>

      {/* Main Layout Grid */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>

        {/* Left: Content Renderer (Dynamic Mode) */}
        <Box sx={{ flex: 2, width: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: isEditMode ? 'transparent' : '#1e293b',
              borderRadius: 3,
              border: isEditMode ? 'none' : '1px solid rgba(255,255,255,0.05)'
            }}
          >
            {isEditMode ? (
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
            isEditMode={isEditMode}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ClassroomPage;