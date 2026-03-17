import { useEffect, useState } from 'react';
import { Box, Stack, Typography, Paper, Button, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TextFormat, Image as ImageIcon, YouTube, Save, Quiz } from '@mui/icons-material';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { PointerSensor, useSensor, useSensors, DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { BulkSaveContentsRequest, Lesson } from '../../types_interfaces/classroom';
import DraftBlock from './LessonContentDraftBlock';
import { bulkSaveLessonContents } from '../../api/classroom.api';
import TableChartIcon from '@mui/icons-material/TableChart';
import MessagePopup from '../feedback/MessagePopup';
import AppLoader from '../feedback/AppLoader';

// --- Main Section ---
const LessonContentSection = ({
  currentLesson,
  onSaveSuccess
}: {
  currentLesson: Lesson | null;
  onSaveSuccess: () => void;
}) => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorPopup, setErrorPopup] = useState({ open: false, message: '' });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  // When lesson changes, load its existing content into drafts
  useEffect(() => {
    if (currentLesson) {
      setIsLocalLoading(true);
      const timer = setTimeout(() => {
        setDrafts(currentLesson.contents.map(c => ({
          ...c,
          tempId: String(c.id),
          test: c.test || null
        })));
        setIsLocalLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentLesson]);

  const addDraft = (type: 'text' | 'image' | 'video' | 'file' | 'chart' | 'test') => {
    let initialBody = '';
    if (type === 'chart') {
      initialBody = JSON.stringify([['Header 1', 'Header 2'], ['Data 1', 'Data 2']]);
    }

    const newBlock: any = {
      tempId: Math.random().toString(),
      contentType: type,
      body: initialBody,
      lessonId: currentLesson?.id,
      test: type === 'test' ? { questions: [], passingScore: 70 } : null
    };

    setDrafts([...drafts, newBlock]);
  };

  const updateBlock = (tempId: string, updates: any) => {
    setDrafts(prev => prev.map(d =>
      d.tempId === tempId ? { ...d, ...updates } : d
    ));
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
      contents: drafts.map((d, index) => {
        let finalBody = d.body;

        // Optional: Prevent saving empty text blocks
        if (d.contentType === 'text' && (finalBody === '<p><br></p>' || !finalBody)) {
          finalBody = "";
        }

        if (['image', 'video', 'file'].includes(d.contentType) && d.body.startsWith('data:')) {
          finalBody = JSON.stringify({
            data: d.body,
            name: d.fileName
          });
        }

        return {
          id: d.id || undefined,
          contentType: d.contentType,
          body: finalBody,
          sortOrder: index,
          test: d.contentType === 'test' ? d.test : null
        };
      })
    };

    try {
      await bulkSaveLessonContents(payload);
      setShowSuccessModal(true);
      onSaveSuccess();
    } catch (e) {
      setErrorPopup({ open: true, message: "Save failed." });
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentLesson) return <Box p={4} sx={{ color: 'gray' }}>Select a lesson to edit content</Box>;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
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
      <Paper sx={{ p: 1, mb: 4, bgcolor: '#1e293b', display: 'inline-flex', gap: 1, flexWrap: 'wrap', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Button size="small" startIcon={<TextFormat />} onClick={() => addDraft('text')} sx={{ color: 'white' }}>Text Field</Button>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Button size="small" startIcon={<ImageIcon />} onClick={() => addDraft('image')} sx={{ color: 'white' }}>Image</Button>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Button size="small" startIcon={<YouTube />} onClick={() => addDraft('video')} sx={{ color: 'white' }}>Video</Button>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Button
          size="small"
          startIcon={<FilePresentIcon />}
          onClick={() => addDraft('file')} // Add 'file' type to your content logic
          sx={{ color: 'white' }}
        >
          Document
        </Button>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Button
          size="small"
          startIcon={<TableChartIcon />}
          onClick={() => addDraft('chart')}
          sx={{ color: '#fbbf24' }} // Amber color for charts
        >
          Chart
        </Button>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
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
      {isLocalLoading ? (
        <Box sx={{ py: 10 }}>
          <AppLoader fullscreen={false} kanji="作" /> {/* "作" for Create/Make */}
        </Box>
      ) : (
        <DndContext
          sensors={sensors} // Added sensors
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={drafts.map(d => d.tempId)} strategy={verticalListSortingStrategy}>
            <Stack spacing={2}> {/* Stack adds nice spacing between blocks */}
              {drafts.length === 0 && (
                <Box sx={{
                  textAlign: 'center',
                  py: 10,
                  border: '2px dashed #334155',
                  borderRadius: 4,
                  color: '#94a3b8'
                }}>
                  <Typography>No content yet. Click a tool above to start building your lesson.</Typography>
                </Box>
              )}
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
      )}

      {/* --- SUCCESS MODAL --- */}
      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)} // Allow closing
        PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Lesson Saved</DialogTitle>
        <DialogContent>
          <Typography sx={{ opacity: 0.8 }}>
            All changes to "{currentLesson?.title}" have been synchronized successfully.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={() => setShowSuccessModal(false)} // Just close it
            sx={{ borderRadius: 2, textTransform: 'none', px: 4, bgcolor: '#6366f1' }}
          >
            Done
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