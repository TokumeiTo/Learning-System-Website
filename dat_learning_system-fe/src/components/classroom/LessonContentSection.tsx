import { useEffect, useState } from 'react';
import { Box, Stack, Typography, Paper, Button, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TextFormat, Image as ImageIcon, YouTube, Save, Quiz } from '@mui/icons-material';
import { PointerSensor, useSensor, useSensors, DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { BulkSaveContentsRequest, Lesson } from '../../types/classroom';
import DraftBlock from './LessonContentDraftBlock';
import { bulkSaveLessonContents } from '../../api/classroom.api';
import MessagePopup from '../feedback/MessagePopup';

// --- Main Section ---
const LessonContentSection = ({ currentLesson }: { currentLesson: Lesson | null }) => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorPopup, setErrorPopup] = useState({ open: false, message: '' });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  // When lesson changes, load its existing content into drafts
  useEffect(() => {
    if (currentLesson) {
      setDrafts(currentLesson.contents.map(c => ({ ...c, tempId: String(c.id) })));
    }
  }, [currentLesson]);

  const addDraft = (type: 'text' | 'image' | 'video' | 'test') => {
    const newBlock = {
      tempId: Math.random().toString(),
      contentType: type,
      // If it's a test, we initialize it with a basic JSON structure
      body: type === 'test' ? JSON.stringify({ questions: [] }) : '',
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
    setIsSaving(true);

    const payload: BulkSaveContentsRequest = {
      lessonId: currentLesson.id,
      contents: drafts.map((d, index) => ({
        id: d.id || undefined, // Send real ID if it exists, undefined if new
        contentType: d.contentType,
        body: d.body,
        sortOrder: index // Use the actual array index for ordering
      }))
    };

    try {
      await bulkSaveLessonContents(payload);
      setShowSuccessModal(true);
    } catch (e) {
      setErrorPopup({ open: true, message: "Save failed. Check your connection." });
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentLesson) return <Box p={4} sx={{ color: 'gray' }}>Select a lesson to edit content</Box>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={800} sx={{ color: 'white' }}>
          {currentLesson?.title}
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <Save />}
          onClick={handleGlobalSave}
          disabled={isSaving}
          sx={{ borderRadius: 2, px: 3 }}
        >
          {isSaving ? "Saving..." : "Save Lesson"}
        </Button>
      </Stack>

      {/* Toolbar */}
      <Paper sx={{ p: 1, mb: 4, bgcolor: '#1e293b', display: 'inline-flex', gap: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
        <Button size="small" startIcon={<TextFormat />} onClick={() => addDraft('text')} sx={{ color: 'white' }}>Text</Button>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Button size="small" startIcon={<ImageIcon />} onClick={() => addDraft('image')} sx={{ color: 'white' }}>Image</Button>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Button size="small" startIcon={<YouTube />} onClick={() => addDraft('video')} sx={{ color: 'white' }}>Video</Button>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

        {/* NEW: Test Button */}
        <Button
          size="small"
          startIcon={<Quiz />}
          onClick={() => addDraft('test')}
          sx={{ color: '#818cf8', fontWeight: 'bold' }}
        >
          Test/Quiz
        </Button>
      </Paper>

      {/* Canvas */}
      <DndContext
        sensors={sensors} // Added sensors
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={drafts.map(d => d.tempId)} strategy={verticalListSortingStrategy}>
          <Stack spacing={2}> {/* Stack adds nice spacing between blocks */}
            {drafts.map((block) => (
              <DraftBlock
                key={block.tempId}
                block={block}
                updateBlock={updateBlock}
                removeBlock={(id: string) => setDrafts(drafts.filter(d => d.tempId !== id))}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>

      {/* --- SUCCESS MODAL --- */}
      <Dialog
        open={showSuccessModal}
        PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Save Successful!</DialogTitle>
        <DialogContent>
          <Typography sx={{ opacity: 0.8 }}>
            The lesson content has been updated. We need to refresh the page to show the live changes.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={() => window.location.reload()} // Simple & Reliable Refresh
            sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
          >
            Refresh & View
          </Button>
        </DialogActions>
      </Dialog>

      <MessagePopup
        open={errorPopup.open}
        message={errorPopup.message}
        severity="error"
        onClose={() => setErrorPopup({ ...errorPopup, open: false })}
      />
    </Box >
  );
};

export default LessonContentSection;