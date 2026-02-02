import { useEffect, useState } from 'react';
import { Box, Stack, Typography, Paper, Button, Divider } from '@mui/material';
import { TextFormat, Image as ImageIcon, YouTube, Save } from '@mui/icons-material';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { BulkSaveContentsRequest, Lesson } from '../../types/classroom';
import DraftBlock from './LessonContentDraftBlock';
import { bulkSaveLessonContents } from '../../api/classroom.api';

// --- Main Section ---
const LessonContentSection = ({ currentLesson }: { currentLesson: Lesson | null }) => {
  const [drafts, setDrafts] = useState<any[]>([]);

  // When lesson changes, load its existing content into drafts
  useEffect(() => {
    if (currentLesson) {
      setDrafts(currentLesson.contents.map(c => ({ ...c, tempId: c.id })));
    }
  }, [currentLesson]);

  const addDraft = (type: 'text' | 'image' | 'video') => {
    const newBlock = {
      tempId: Math.random().toString(),
      contentType: type,
      body: '',
      lessonId: currentLesson?.id
    };
    setDrafts([...drafts, newBlock]);
  };

  const updateBlock = (tempId: string, value: string) => {
    setDrafts(drafts.map(d => d.tempId === tempId ? { ...d, body: value } : d));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = drafts.findIndex(d => d.tempId === active.id);
      const newIndex = drafts.findIndex(d => d.tempId === over.id);
      setDrafts(arrayMove(drafts, oldIndex, newIndex));
    }
  };

  const handleGlobalSave = async () => {
    if (!currentLesson) return;

    const payload: BulkSaveContentsRequest = {
      lessonId: currentLesson.id,
      contents: drafts.map(d => ({
        contentType: d.contentType,
        body: d.body
      }))
    };

    try {
      await bulkSaveLessonContents(payload);
      alert("Lesson content saved successfully!");
      // Optional: Refresh data from parent
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  if (!currentLesson) return <Box p={4}>Select a lesson</Box>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={800} sx={{color: 'white'}}>{currentLesson.title}</Typography>
        <Button variant="contained" color="success" startIcon={<Save />} onClick={handleGlobalSave}>
          Save Lesson
        </Button>
      </Stack>

      {/* Toolbar */}
      <Paper sx={{ p: 1, mb: 4, bgcolor: '#1e293b', display: 'inline-flex', gap: 1 }}>
        <Button size="small" startIcon={<TextFormat />} onClick={() => addDraft('text')} sx={{ color: 'white' }}>Text</Button>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Button size="small" startIcon={<ImageIcon />} onClick={() => addDraft('image')} sx={{ color: 'white' }}>Image</Button>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Button size="small" startIcon={<YouTube />} onClick={() => addDraft('video')} sx={{ color: 'white' }}>Video</Button>
      </Paper>

      {/* Canvas */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={drafts.map(d => d.tempId)} strategy={verticalListSortingStrategy}>
          {drafts.map((block) => (
            <DraftBlock
              key={block.tempId}
              block={block}
              updateBlock={updateBlock}
              removeBlock={(id: string) => setDrafts(drafts.filter(d => d.tempId !== id))}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
};

export default LessonContentSection;