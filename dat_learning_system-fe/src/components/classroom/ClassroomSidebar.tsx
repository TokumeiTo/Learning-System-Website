import { useState } from 'react';
import { Paper, Tabs, Tab, Box, Typography } from '@mui/material';
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

  return (
    <Paper sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="fullWidth"
        sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Tab label="Curriculum" sx={{ textTransform: 'none' }} />
        <Tab label="Classwork" sx={{ textTransform: 'none' }} />
        <Tab label="Chat" sx={{ textTransform: 'none' }} />
      </Tabs>

      <Box sx={{ p: 1 }}>
        {activeTab === 0 && (
          <CurriculumTab
            data={data}
            setData={setData}
            currentLesson={currentLesson}
            setCurrentLesson={setCurrentLesson}
            isEditMode={isEditMode}
          />
        )}
        {activeTab === 1 && <Typography sx={{ p: 4, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No classwork assigned yet.</Typography>}
        {activeTab === 2 && <Typography sx={{ p: 4, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Chat is unavailable.</Typography>}
      </Box>
    </Paper>
  );
};

export default ClassroomSidebar;