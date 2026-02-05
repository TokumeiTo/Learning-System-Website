import { useState } from 'react';
import {
    List, Typography, Box, Paper, TextField, Stack, Button, 
    CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { AccessTime, Add as AddIcon } from '@mui/icons-material';

// DND Kit Imports
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors, type DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { createLesson, reorderLessons, updateLesson, deleteLesson } from '../../api/classroom.api';
import type { ClassroomView, Lesson } from '../../types/classroom';
import SortableLessonItem from './SortTableLessonItem';

type CurriculumTabProps = {
    data: ClassroomView;
    setData: React.Dispatch<React.SetStateAction<ClassroomView | null>>;
    currentLesson: Lesson | null;
    setCurrentLesson: (lesson: Lesson) => void;
    isEditMode: boolean;
};

const CurriculumTab = ({ data, setData, currentLesson, setCurrentLesson, isEditMode }: CurriculumTabProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    
    // State for the Delete Confirmation Dialog
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // --- REORDER LOGIC ---
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = data.lessons.findIndex((l) => l.id === active.id);
            const newIndex = data.lessons.findIndex((l) => l.id === over.id);
            const newOrder = arrayMove(data.lessons, oldIndex, newIndex);
            
            // Optimistic Update
            setData({ ...data, lessons: newOrder });
            
            setIsSaving(true);
            try {
                await reorderLessons({
                    courseId: data.courseId,
                    lessonIds: newOrder.map(l => l.id)
                });
            } catch (e) {
                console.error("Reorder failed", e);
                // In a production app, you'd revert the state here on error
            } finally {
                setIsSaving(false);
            }
        }
    };

    // --- CREATE LOGIC ---
    const handleCreate = async () => {
        if (!title.trim()) return;
        try {
            const nextOrder = data.lessons.length > 0 
                ? Math.max(...data.lessons.map(l => l.sortOrder)) + 1 
                : 1;
                
            const newLesson = await createLesson({
                courseId: data.courseId,
                title,
                sortOrder: nextOrder,
                time: time.trim() || "-:--"
            });

            setData({ ...data, lessons: [...data.lessons, newLesson] });
            setIsAdding(false);
            setTitle(''); setTime('');
        } catch (e) { console.error(e); }
    };

    // --- UPDATE LOGIC (Called from SortableLessonItem) ---
    const handleUpdateLesson = async (id: string, newTitle: string, newTime: string) => {
        try {
            const updated = await updateLesson(id, { id, title: newTitle, time: newTime });
            
            setData({
                ...data,
                lessons: data.lessons.map(l => l.id === id ? updated : l)
            });
        } catch (e) {
            console.error("Update failed", e);
        }
    };

    // --- DELETE LOGIC ---
    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteLesson(deleteId);
            
            const filteredLessons = data.lessons.filter(l => l.id !== deleteId);
            setData({ ...data, lessons: filteredLessons });

            // If we deleted the lesson currently being viewed, switch to another one
            if (currentLesson?.id === deleteId) {
                setCurrentLesson(filteredLessons[0] || null);
            }
        } catch (e) {
            console.error("Delete failed", e);
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, px: 1 }}>
                <Typography variant="overline" sx={{ fontWeight: 900, color: 'gray', fontSize: '12px' }}>
                    {isEditMode ? 'Manage Curriculum' : 'Course Content'}
                </Typography>
                {isSaving && <CircularProgress size={16} sx={{ color: '#6366f1' }} />}
            </Stack>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={data.lessons.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    <List sx={{ pt: 0 }}>
                        {data.lessons.map((item) => (
                            <SortableLessonItem
                                key={item.id}
                                item={item}
                                isEditMode={isEditMode}
                                currentLessonId={currentLesson?.id}
                                onSelect={setCurrentLesson}
                                onUpdate={handleUpdateLesson}
                                onDelete={setDeleteId} // Opens the dialog
                            />
                        ))}
                    </List>
                </SortableContext>
            </DndContext>

            {isEditMode && (
                <Box sx={{ mt: 2, px: 1 }}>
                    {isAdding ? (
                        <Paper sx={{ p: 2, bgcolor: '#1e293b', borderRadius: 3, border: '1px solid #6366f1' }}>
                            <Stack spacing={1.5}>
                                <TextField
                                    autoFocus fullWidth size="small" placeholder="Lesson Title..."
                                    value={title} onChange={(e) => setTitle(e.target.value)} variant="standard"
                                    InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '0.9rem' } }}
                                />
                                <TextField
                                    fullWidth size="small" placeholder="Duration (e.g. 10:00)" 
                                    value={time} onChange={(e) => setTime(e.target.value)} variant="standard"
                                    InputProps={{
                                        disableUnderline: true,
                                        startAdornment: <AccessTime sx={{ fontSize: 14, mr: 1, opacity: 0.5 }} />,
                                        sx: { color: 'rgb(255, 255, 255)', fontSize: '0.8rem' }
                                    }}
                                />
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button size="small" onClick={() => setIsAdding(false)} sx={{ color: 'white', opacity: 0.5 }}>Cancel</Button>
                                    <Button size="small" variant="contained" onClick={handleCreate} sx={{ borderRadius: 1.5, bgcolor: '#6366f1' }}>Add</Button>
                                </Stack>
                            </Stack>
                        </Paper>
                    ) : (
                        <Button
                            fullWidth startIcon={<AddIcon />}
                            onClick={() => setIsAdding(true)}
                            sx={{ 
                                py: 1, border: '1px dashed rgba(255,255,255,0.1)', 
                                color: 'rgba(255,255,255,0.5)', textTransform: 'none', borderRadius: 2,
                                '&:hover': { border: '1px dashed #6366f1', color: '#6366f1' }
                            }}
                        >
                            Add Lesson
                        </Button>
                    )}
                </Box>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog 
                open={Boolean(deleteId)} 
                onClose={() => setDeleteId(null)}
                PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 3 } }}
            >
                <DialogTitle>Delete Lesson?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        This action cannot be undone. All contents within this lesson will be permanently removed.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteId(null)} sx={{ color: 'white' }}>Cancel</Button>
                    <Button onClick={confirmDelete} variant="contained" color="error" sx={{ borderRadius: 2 }}>
                        Delete Permanently
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CurriculumTab;