import { useState } from 'react';
import { Paper, Tabs, Tab, Box, Typography, Fade } from '@mui/material';
import type { ClassroomView } from '../../types/classroom';
import CurriculumTab from './CurriculumTab';

interface Props {
  data: ClassroomView;
  setData: React.Dispatch<React.SetStateAction<ClassroomView | null>>;
  currentLessonId: string | null;
  setCurrentLessonId: (id: string) => void;
  isEditMode: boolean;
}

const ClassroomSidebar = ({ 
  data, 
  setData, 
  currentLessonId, 
  setCurrentLessonId, 
  isEditMode 
}: Props) => {
  const [activeTab, setActiveTab] = useState(0);

  /**
   * Guarded navigation:
   * Prevents students from clicking into locked lessons, 
   * while allowing Admins full access during Edit Mode.
   */
  const handleLessonChange = (lessonId: string) => {
    if (lessonId === currentLessonId) return;

    // Find the lesson in our current data to check its status
    const targetLesson = data.lessons.find(l => l.id === lessonId);
    
    if (!targetLesson) return;

    // Logic check: Only allow if not locked OR if user is an Admin in Edit Mode
    if (targetLesson.isLocked && !isEditMode) {
      console.warn("This lesson is locked. Complete previous lessons first.");
      return;
    }

    setCurrentLessonId(lessonId);
  };

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
            color: 'rgba(255,255,255,0.4)',
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