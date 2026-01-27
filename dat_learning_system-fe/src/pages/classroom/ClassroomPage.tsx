import React, { useState } from 'react';
import { 
  Box, Typography, Stack, Paper, Tab, Tabs, Button, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Avatar, TextField, Chip, IconButton 
} from '@mui/material';
import { 
  PlayCircle, ChevronRight, Lock, AttachFile, CheckCircle, Article, Send 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Lesson {
  id: number;
  title: string;
  time: string;
  done: boolean;
  locked: boolean;
  description: string;
  type: 'video' | 'reading';
}

// 1. Define the full curriculum data here
const lessons: Lesson[] = [
  { 
    id: 1, 
    title: "Intro to Business JP", 
    time: "5:00", 
    done: true, 
    locked: false,
    description: "An overview of the cultural expectations in a Japanese corporate environment.",
    type: 'video'
  },
  { 
    id: 2, 
    title: "The IT Hierarchy", 
    time: "12:00", 
    done: true, 
    locked: false,
    description: "Understanding who's who in a tech team, from Junior Devs to the CTO (Shachou).",
    type: 'reading'
  },
  { 
    id: 3, 
    title: "Keigo in Sales", 
    time: "15:20", 
    done: false,
    locked: false,
    description: "Nuances of using honorifics specifically during technical software demonstrations.",
    type: 'video'
  },
  { 
    id: 4, 
    title: "Client Email Etiquette", 
    time: "08:45", 
    done: false, 
    locked: false,
    description: "How to draft professional follow-up emails after a successful sales pitch.",
    type: 'reading'
  },
  { 
    id: 5, 
    title: "Live Demo Scenario", 
    time: "20:00", 
    done: false, 
    locked: true, 
    description: "Practical simulation of a live product demo in Japanese.",
    type: 'video'
  }
];

const ClassroomPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // 2. Set the state to the FIRST lesson (or whichever you want to start with)
  const [currentLesson, setCurrentLesson] = useState<Lesson>(lessons[0]);

  const handleLessonSelect = (lesson: Lesson) => {
    if (!lesson.locked) {
      setCurrentLesson(lesson);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', color: 'white', p: { xs: 2, md: 4 } }}>
      
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: -0.5 }}>
            JLPT N5: Beginner Foundation
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 700, textTransform: 'uppercase' }}>
            Current: {currentLesson.title}
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/courses')}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', borderRadius: 2, textTransform: 'none' }}
        >
          Exit Classroom
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        
        {/* Main Content Area */}
        <Box sx={{ flex: 2, width: '100%' }}>
          <Paper 
            elevation={24} 
            sx={{ 
              width: '100%', aspectRatio: '16/9', bgcolor: 'black', 
              borderRadius: 6, overflow: 'hidden', mb: 3,
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
             {currentLesson.type === 'video' ? (
                <PlayCircle sx={{ fontSize: 80, opacity: 0.5, color: '#6366f1' }} />
             ) : (
                <Article sx={{ fontSize: 80, opacity: 0.5, color: '#10b981' }} />
             )}
          </Paper>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={800}>
                {currentLesson.type === 'video' ? 'Video Lesson' : 'Reading Material'}
            </Typography>
            <Chip label="Assignment Due in 2 days" color="warning" size="small" sx={{ fontWeight: 700 }} />
          </Stack>
          
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '1.1rem' }}>
            {currentLesson.description}
          </Typography>
        </Box>

        {/* Sidebar Command Center */}
        <Paper sx={{ 
          flex: 1, minWidth: { lg: 400 }, borderRadius: 6, 
          bgcolor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', height: 'fit-content', maxH: '85vh'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, v) => setActiveTab(v)} 
            variant="fullWidth" 
            sx={{ 
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.75rem' },
              '& .Mui-selected': { color: '#6366f1 !important' }
            }}
          >
            <Tab label="Curriculum" />
            <Tab label="Classwork" />
            <Tab label="Chat" />
          </Tabs>

          <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
            {activeTab === 0 && (
              <List disablePadding>
                {lessons.map((item) => (
                  <ListItem disablePadding key={item.id} sx={{ mb: 1 }}>
                    <ListItemButton 
                      onClick={() => handleLessonSelect(item)}
                      disabled={item.locked}
                      sx={{ 
                        borderRadius: 3, 
                        bgcolor: currentLesson.id === item.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        border: currentLesson.id === item.id ? '1px solid #6366f1' : '1px solid transparent',
                        "&.Mui-disabled": { opacity: 0.4, color: 'white' }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: item.done ? '#10b981' : 'white' }}>
                        {item.done ? <CheckCircle fontSize="small" /> : item.locked ? <Lock fontSize="small" /> : <PlayCircle fontSize="small" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.title} 
                        secondary={item.time} 
                        primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}
                        secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }} 
                      />
                      {currentLesson.id === item.id && <ChevronRight sx={{ color: '#6366f1' }} />}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}

            {activeTab === 1 && (
              <Stack spacing={3}>
                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom>Submit {currentLesson.title} Task</Typography>
                  <Button fullWidth variant="contained" startIcon={<AttachFile />} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }}>
                    Upload Submission
                  </Button>
                </Box>
              </Stack>
            )}

            {activeTab === 2 && (
              <Stack sx={{ height: 400 }}>
                <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                   <Stack direction="row" spacing={1}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: 10 }}>T</Avatar>
                      <Paper sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '0 12px 12px 12px' }}>
                        <Typography variant="caption" fontWeight={800}>Teacher</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Ask anything about "{currentLesson.title}" here!</Typography>
                      </Paper>
                    </Stack>
                </Box>
                <TextField 
                  fullWidth placeholder="Ask a question..." 
                  variant="outlined" size="small"
                  InputProps={{ 
                    sx: { borderRadius: 3, color: 'white', bgcolor: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' },
                    endAdornment: <IconButton color="primary"><Send fontSize="small" /></IconButton>
                  }} 
                />
              </Stack>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ClassroomPage;