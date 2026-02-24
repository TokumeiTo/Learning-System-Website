import { useState } from 'react';
import { Paper, Tabs, Tab, Box, Typography, Fade } from '@mui/material';
import type { ClassroomView, Lesson } from '../../types/classroom';
import CurriculumTab from './CurriculumTab';

interface Props {
  data: ClassroomView;
  setData: React.Dispatch<React.SetStateAction<ClassroomView | null>>;
  currentLesson: Lesson | null;
  setCurrentLesson: (lesson: Lesson) => void;
  isEditMode: boolean;
}

const ClassroomSidebar = ({ data, setData, currentLesson, setCurrentLesson, isEditMode }: Props) => {
  const [activeTab, setActiveTab] = useState(0);

  // Helper to handle lesson switching with future-proofing for "Unsaved Changes" or "Active Test"
  const handleLessonChange = (lesson: Lesson) => {
    if (lesson.id === currentLesson?.id) return;
    
    // Logic check: Only allow navigation if not locked OR if in Edit Mode
    if (lesson.isLocked && !isEditMode) return;

    setCurrentLesson(lesson);
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        bgcolor: '#1e293b', // Match ClassroomPage depth
        borderRadius: 4, 
        overflow: 'hidden', 
        border: '1px solid rgba(255,255,255,0.05)',
        height: 'fit-content',
        position: 'sticky',
        top: 24
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
            color: 'rgba(255,255,255,0.5)',
            '&.Mui-selected': { color: '#818cf8' } 
          }
        }}
      >
        <Tab label="Curriculum" />
        <Tab label="Classwork" />
        <Tab label="Chat" />
      </Tabs>

      <Box sx={{ p: 1, minHeight: 400 }}>
        {/* Tab Panel: Curriculum */}
        {activeTab === 0 && (
          <Fade in={activeTab === 0}>
            <Box>
              <CurriculumTab
                data={data}
                setData={setData}
                currentLesson={currentLesson}
                setCurrentLesson={handleLessonChange} // Using our guarded function
                isEditMode={isEditMode}
              />
            </Box>
          </Fade>
        )}

        {/* Tab Panel: Classwork */}
        {activeTab === 1 && (
          <Fade in={activeTab === 1}>
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                Assignments and resources will appear here.
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Tab Panel: Chat */}
        {activeTab === 2 && (
          <Fade in={activeTab === 2}>
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                Study group chat is currently disabled.
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>
    </Paper>
  );
};

export default ClassroomSidebar;