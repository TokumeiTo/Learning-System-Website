import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Stack, Paper, Tab, Tabs, Button, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, CircularProgress 
} from '@mui/material';
import { PlayCircle, Lock, AttachFile, CheckCircle } from '@mui/icons-material';

// Import your API service (Assume you created this in step 6 of the previous response)
import { fetchClassroomData } from '../../api/classroom.api';
import type { ClassroomView, Lesson } from '../../types/classroom';

const ClassroomPage = () => {
  const { id } = useParams<{ id: string }>(); // Grabs the GUID from URL
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ClassroomView | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchClassroomData(id)
        .then((res) => {
          setData(res);
          // Set the first lesson as active by default
          if (res.lessons.length > 0) {
            setCurrentLesson(res.lessons[0]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleLessonSelect = (lesson: Lesson) => {
    if (!lesson.isLocked) setCurrentLesson(lesson);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f172a' }}>
      <CircularProgress />
    </Box>
  );

  if (!data) return <Typography>Course Not Found</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', color: 'white', p: { xs: 2, md: 4 } }}>
      
      {/* Header - Real Data */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={900}>
            {data.courseTitle}
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 700 }}>
            Current: {currentLesson?.title || 'Select a Lesson'}
          </Typography>
        </Box>
        <Button onClick={() => navigate('/courses')} sx={{ color: 'white' }}>Exit</Button>
      </Stack>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        
        {/* Main Content Renderer */}
        <Box sx={{ flex: 2, width: '100%' }}>
          <Stack spacing={4}>
            {currentLesson?.contents.map((block) => (
              <Box key={block.id} sx={{ width: '100%' }}>
                {block.contentType === 'text' && (
                  <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                    {block.body}
                  </Typography>
                )}
                {block.contentType === 'video' && (
                  <Paper sx={{ width: '100%', aspectRatio: '16/9', bgcolor: 'black' }}>
                    <iframe width="100%" height="100%" src={block.body} frameBorder="0" allowFullScreen />
                  </Paper>
                )}
                {block.contentType === 'image' && (
                  <Box component="img" src={block.body} sx={{ width: '100%', borderRadius: 4 }} />
                )}
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Sidebar - Real Curriculum */}
        <Paper sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="fullWidth">
            <Tab label="Curriculum" />
            <Tab label="Classwork" />
            <Tab label="Chat" />
          </Tabs>

          <Box sx={{ p: 2 }}>
            {activeTab === 0 && (
              <List>
                {data.lessons.map((item) => (
                  <ListItem disablePadding key={item.id} sx={{ mb: 1 }}>
                    <ListItemButton 
                      onClick={() => handleLessonSelect(item)}
                      disabled={item.isLocked}
                      selected={currentLesson?.id === item.id}
                      sx={{ borderRadius: 3 }}
                    >
                      <ListItemIcon sx={{ color: item.isDone ? '#10b981' : 'white' }}>
                        {item.isDone ? <CheckCircle /> : item.isLocked ? <Lock /> : <PlayCircle />}
                      </ListItemIcon>
                      <ListItemText primary={item.title} secondary={item.time} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
            {/* Classwork and Chat tabs remain as you had them... */}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ClassroomPage;