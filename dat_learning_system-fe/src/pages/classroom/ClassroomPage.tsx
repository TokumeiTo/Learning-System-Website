import { useState } from 'react';
import { 
  Box, Typography, Stack, Paper, Tab, Tabs, Button, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField
} from '@mui/material';
import { 
  PlayCircle, Lock, AttachFile, CheckCircle 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// 1. Define the dynamic Content Block structure
interface LessonContent {
  id: string;
  type: 'text' | 'image' | 'video';
  body: string; // Text content or URL
}

interface Lesson {
  id: number;
  title: string;
  time: string;
  done: boolean;
  locked: boolean;
  contents: LessonContent[]; // The array that allows "Free Will" ordering
}

// 2. Mock Data with sequential content blocks
const mockLessons: Lesson[] = [
  { 
    id: 1, 
    title: "Introduction to Hiragana", 
    time: "10:00", 
    done: true, 
    locked: false,
    contents: [
      {
        id: 'c1',
        type: 'text',
        body: `What is Hiragana?\n          hello, In this lesson we are about to Japanese traditional writing.....\n  There are 3 types of writing styles in Japanese,\n        1. Hiragana\n        2. Katakana\n        3. Kanji`
      },
      {
        id: 'c2',
        type: 'image',
        body: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'c3',
        type: 'text',
        body: `Above is a visual reference for your studies.\nKeep in mind that Hiragana is used for native Japanese words and grammar particles.`
      }
    ]
  },
  { 
    id: 2, 
    title: "The IT Hierarchy", 
    time: "12:00", 
    done: false, 
    locked: false,
    contents: [
      {
        id: 'c4',
        type: 'video',
        body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Mock video link
      },
      {
        id: 'c5',
        type: 'text',
        body: "Understanding who's who in a tech team, from Junior Devs to the CTO (Shachou)."
      }
    ]
  }
];

const ClassroomPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(mockLessons[0]);

  const handleLessonSelect = (lesson: Lesson) => {
    if (!lesson.locked) setCurrentLesson(lesson);
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
        
        {/* Main Content Area (The "Free Will" Renderer) */}
        <Box sx={{ flex: 2, width: '100%' }}>
          <Stack spacing={4}>
            {currentLesson.contents.map((block) => (
              <Box key={block.id} sx={{ width: '100%' }}>
                
                {block.type === 'text' && (
                  <Typography sx={{ 
                    whiteSpace: 'pre-wrap', // This keeps the creator's spaces and enters
                    lineHeight: 1.8, 
                    fontSize: '1.1rem',
                    color: 'rgba(255,255,255,0.85)',
                    fontFamily: 'monospace' // Optional: use monospace if they want exact alignment
                  }}>
                    {block.body}
                  </Typography>
                )}

                {block.type === 'video' && (
                  <Paper sx={{ 
                    width: '100%', aspectRatio: '16/9', bgcolor: 'black', 
                    borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' 
                  }}>
                    <iframe 
                      width="100%" height="100%" 
                      src={block.body} 
                      title="Video Player" 
                      frameBorder="0" 
                      allowFullScreen 
                    />
                  </Paper>
                )}

                {block.type === 'image' && (
                  <Box 
                    component="img" 
                    src={block.body} 
                    sx={{ width: '100%', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
                  />
                )}

              </Box>
            ))}
            
            {/* Navigation Buttons for Lesson Flow */}
            <Stack direction="row" spacing={2} sx={{ pt: 4 }}>
               <Button variant="contained" sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 800 }}>
                 Mark as Completed
               </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Sidebar Command Center */}
        <Paper sx={{ 
          flex: 1, minWidth: { lg: 400 }, borderRadius: 6, 
          bgcolor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', height: 'fit-content'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, v) => setActiveTab(v)} 
            variant="fullWidth" 
            sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Tab label="Curriculum" sx={{ fontWeight: 700, fontSize: '0.75rem' }} />
            <Tab label="Classwork" sx={{ fontWeight: 700, fontSize: '0.75rem' }} />
            <Tab label="Chat" sx={{ fontWeight: 700, fontSize: '0.75rem' }} />
          </Tabs>

          <Box sx={{ p: 2, flex: 1, overflowY: 'auto', maxHeight: '70vh' }}>
            {activeTab === 0 && (
              <List disablePadding>
                {mockLessons.map((item) => (
                  <ListItem disablePadding key={item.id} sx={{ mb: 1 }}>
                    <ListItemButton 
                      onClick={() => handleLessonSelect(item)}
                      disabled={item.locked}
                      sx={{ 
                        borderRadius: 3, 
                        bgcolor: currentLesson.id === item.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        border: currentLesson.id === item.id ? '1px solid #6366f1' : '1px solid transparent',
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: item.done ? '#10b981' : 'white' }}>
                        {item.done ? <CheckCircle /> : item.locked ? <Lock /> : <PlayCircle />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.title} 
                        secondary={item.time} 
                        primaryTypographyProps={{ fontWeight: 700, color: 'white' }}
                        secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }} 
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}

            {activeTab === 1 && (
              <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>
                <Typography variant="subtitle2" fontWeight={800} gutterBottom>Assignments</Typography>
                <Button fullWidth variant="contained" startIcon={<AttachFile />} sx={{ borderRadius: 3 }}>
                  Upload File
                </Button>
              </Box>
            )}

            {activeTab === 2 && (
              <Stack spacing={2}>
                <Box sx={{ height: 200, overflowY: 'auto', bgcolor: 'rgba(0,0,0,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="primary.light">System: Chat is ready.</Typography>
                </Box>
                <TextField 
                  fullWidth placeholder="Message teacher..." 
                  size="small"
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 3, color: 'white', bgcolor: 'rgba(255,255,255,0.05)' }}}
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