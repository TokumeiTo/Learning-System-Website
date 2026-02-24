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
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Sensors configured for better UX (distance prevents accidental drags on click)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // --- REORDER LOGIC ---
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id && isEditMode) {
            const oldIndex = data.lessons.findIndex((l) => l.id === active.id);
            const newIndex = data.lessons.findIndex((l) => l.id === over.id);
            
            const originalOrder = [...data.lessons];
            const newOrder = arrayMove(data.lessons, oldIndex, newIndex);
            
            // 1. Optimistic Update (Immediate UI feedback)
            setData({ ...data, lessons: newOrder });
            
            setIsSaving(true);
            try {
                // 2. Persist to DB
                await reorderLessons({
                    courseId: data.courseId,
                    lessonIds: newOrder.map(l => l.id as string)
                });
            } catch (e) {
                console.error("Reorder failed", e);
                // 3. Rollback on failure
                setData({ ...data, lessons: originalOrder });
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
                time: time.trim() || "0:00"
            });

            setData({ ...data, lessons: [...data.lessons, newLesson] });
            setIsAdding(false);
            setTitle(''); setTime('');
        } catch (e) { console.error("Creation failed", e); }
    };

    // --- UPDATE LOGIC ---
    const handleUpdateLesson = async (id: string, newTitle: string, newTime: string) => {
        try {
            const updated = await updateLesson(id, { id, title: newTitle, time: newTime });
            setData({
                ...data,
                lessons: data.lessons.map(l => l.id === id ? { ...l, ...updated } : l)
            });
        } catch (e) { console.error("Update failed", e); }
    };

    // --- DELETE LOGIC ---
    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteLesson(deleteId);
            const filteredLessons = data.lessons.filter(l => l.id !== deleteId);
            setData({ ...data, lessons: filteredLessons });

            if (currentLesson?.id === deleteId) {
                setCurrentLesson(filteredLessons[0] || null);
            }
        } catch (e) { console.error("Delete failed", e); } finally {
            setDeleteId(null);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5, px: 1 }}>
                <Typography variant="overline" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>
                    {isEditMode ? 'ADMIN CURRICULUM' : 'COURSE CONTENTS'}
                </Typography>
                {isSaving && <CircularProgress size={14} thickness={6} sx={{ color: '#818cf8' }} />}
            </Stack>

            {/* Draggable List */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={data.lessons.map(l => l.id as string)} strategy={verticalListSortingStrategy}>
                    <List sx={{ pt: 0, '& > *:not(:last-child)': { mb: 0.5 } }}>
                        {data.lessons.map((item) => (
                            <SortableLessonItem
                                key={item.id}
                                item={item}
                                isEditMode={isEditMode}
                                currentLessonId={currentLesson?.id}
                                onSelect={setCurrentLesson}
                                onUpdate={handleUpdateLesson}
                                onDelete={setDeleteId}
                            />
                        ))}
                    </List>
                </SortableContext>
            </DndContext>

            {/* Add Lesson Section */}
            {isEditMode && (
                <Box sx={{ mt: 2, px: 1 }}>
                    {isAdding ? (
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(99, 102, 241, 0.05)', borderRadius: 3, border: '1px solid #6366f1' }}>
                            <Stack spacing={2}>
                                <TextField
                                    autoFocus fullWidth size="small" placeholder="Lesson Title (e.g., Intro to Hiragana)"
                                    value={title} onChange={(e) => setTitle(e.target.value)} variant="standard"
                                    InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '0.95rem', fontWeight: 600 } }}
                                />
                                <TextField
                                    fullWidth size="small" placeholder="Duration" 
                                    value={time} onChange={(e) => setTime(e.target.value)} variant="standard"
                                    InputProps={{
                                        disableUnderline: true,
                                        startAdornment: <AccessTime sx={{ fontSize: 16, mr: 1, opacity: 0.5 }} />,
                                        sx: { color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }
                                    }}
                                />
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button size="small" onClick={() => setIsAdding(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Cancel</Button>
                                    <Button size="small" variant="contained" onClick={handleCreate} sx={{ borderRadius: 1.5, bgcolor: '#6366f1', textTransform: 'none', px: 3 }}>Add Lesson</Button>
                                </Stack>
                            </Stack>
                        </Paper>
                    ) : (
                        <Button
                            fullWidth startIcon={<AddIcon />}
                            onClick={() => setIsAdding(true)}
                            sx={{ 
                                py: 1.5, border: '1px dashed rgba(255,255,255,0.1)', 
                                color: 'rgba(255,255,255,0.5)', textTransform: 'none', borderRadius: 3,
                                '&:hover': { border: '1px dashed #6366f1', color: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.05)' }
                            }}
                        >
                            Add New Lesson
                        </Button>
                    )}
                </Box>
            )}

            {/* Global Delete Confirmation */}
            <Dialog 
                open={Boolean(deleteId)} 
                onClose={() => setDeleteId(null)}
                PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 4, backgroundImage: 'none' } }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Deleting this lesson will permanently remove all associated Kanji, videos, and Japanese tests. This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDeleteId(null)} sx={{ color: 'white', textTransform: 'none' }}>Keep Lesson</Button>
                    <Button onClick={confirmDelete} variant="contained" color="error" sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
                        Yes, Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CurriculumTab;