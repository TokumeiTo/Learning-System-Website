import { useEffect, useState } from 'react';
import {
    ListItem, ListItemButton, ListItemIcon, ListItemText,
    Typography, TextField, Stack, IconButton
} from '@mui/material';
import {
    CheckCircle, PlayCircle, DragIndicator as DragIcon,
    Edit as EditIcon, DeleteOutline as DeleteIcon,
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
} from '@mui/icons-material';
import QuizIcon from '@mui/icons-material/Quiz';
import { motion, AnimatePresence } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Lesson } from '../../types_interfaces/classroom';

type SortableItemProps = {
    item: Lesson;
    isEditMode: boolean;
    currentLessonId: string | null;
    onSelect: () => void;
    onUpdate: (id: string, title: string, time: string) => Promise<void>;
    onDelete: (id: string) => void;
};

const SortableLessonItem = ({
    item,
    isEditMode,
    currentLessonId,
    onSelect,
    onUpdate,
    onDelete
}: SortableItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(item.title);
    const [editTime, setEditTime] = useState(item.time);
    const [prevLocked, setPrevLocked] = useState(item.isLocked);
    const [showUnlockAnim, setShowUnlockAnim] = useState(false);
    const isTestLesson = item.title.toLowerCase().includes('test');
    const testColor = '#a7f3d0';
    const activeColor = '#6366f1';

    const {
        attributes, listeners, setNodeRef, transform, transition, isDragging
    } = useSortable({
        id: item.id,
        disabled: !isEditMode || isEditing
    });

    const style = {
        color: 'white',
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 0,
        opacity: isDragging ? 0.6 : 1,
    };

    const handleSave = async () => {
        if (!editTitle.trim()) {
            setEditTitle(item.title);
            setIsEditing(false);
            return;
        }

        if (editTitle.trim() !== item.title || editTime !== item.time) {
            try {
                await onUpdate(item.id, editTitle, editTime);
            } catch (err) {
                setEditTitle(item.title);
                setEditTime(item.time);
            }
        }
        setIsEditing(false);
    };

    useEffect(() => {
        if (prevLocked && !item.isLocked) {
            setShowUnlockAnim(true);
            setTimeout(() => setShowUnlockAnim(false), 2000);
        }
        setPrevLocked(item.isLocked);
    }, [item.isLocked, prevLocked]);

    return (
        <ListItem
            ref={setNodeRef}
            style={style}
            disablePadding
            sx={{
                mb: 0.5,
                '&:hover .item-actions': { opacity: 1 }
            }}
        >
            <ListItemButton
                disabled={item.isLocked && !isEditMode}
                selected={currentLessonId === item.id}
                // Prevent selection while editing to stop focus jumping
                onClick={() => !isEditing && onSelect()}
                sx={{
                    borderRadius: 2,
                    minHeight: '70px',
                    px: 1,
                    transition: '0.2s',
                    '&.Mui-disabled': { opacity: 0.5, cursor: 'not-allowed' },
                    '&.Mui-selected': {
                        bgcolor: 'rgba(99, 102, 241, 0.15)',
                        borderRight: '3px solid #6366f1'
                    },
                }}
            >
                {/* 1. Drag Handle */}
                {isEditMode && !isEditing && (
                    <ListItemIcon
                        {...attributes} {...listeners}
                        sx={{ minWidth: 28, color: 'rgba(255,255,255,0.2)', cursor: 'grab' }}
                    >
                        <DragIcon fontSize="small" />
                    </ListItemIcon>
                )}

                {/* 2. Status Icon */}
                <ListItemIcon sx={{
                    minWidth: 32,
                    color: item.isLocked && !isEditMode
                        ? 'rgba(255,255,255,0.2)'
                        : item.isDone
                            ? '#10b981'
                            : isTestLesson ? testColor : activeColor // Light green if it's a test
                }}>
                    <AnimatePresence mode="wait">
                        {item.isLocked && !isEditMode ? (
                            <motion.div key="locked" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0, rotate: -10 }}>
                                <LockIcon sx={{ fontSize: 18 }} />
                            </motion.div>
                        ) : showUnlockAnim ? (
                            <motion.div key="unlocking" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5 }}>
                                <LockOpenIcon sx={{ fontSize: 18 }} />
                            </motion.div>
                        ) : item.isDone ? (
                            <motion.div key="done" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                <CheckCircle fontSize="small" />
                            </motion.div>
                        ) : isTestLesson ? (
                            <motion.div
                                key="test-icon"
                                initial={{ opacity: 0, rotate: -20 }}
                                animate={{ opacity: 1, rotate: 0 }}
                            >
                                {/* Assignment or Quiz icon works well for "Tests" */}
                                <QuizIcon fontSize="small" sx={{ color: 'cyan' }} />
                            </motion.div>
                        ) : (
                            // DEFAULT PLAY CIRCLE
                            <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <PlayCircle fontSize="small" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </ListItemIcon>

                {/* 3. Content */}
                <ListItemText
                    primary={
                        isEditing ? (
                            <TextField
                                variant="standard" fullWidth autoFocus
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                // Stop propagation to prevent dnd-kit "stuck" mode
                                onMouseDown={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '0.875rem', fontWeight: 600 } }}
                            />
                        ) : (
                            <Typography variant="body2" sx={{
                                color: (isTestLesson && !item.isLocked) ? 'cyan' : 'white',
                                fontWeight: currentLessonId === item.id ? 900 : 500
                            }}>
                                {item.title}
                            </Typography>
                        )
                    }
                    secondary={
                        isEditing ? (
                            <TextField
                                variant="standard" fullWidth
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
                                onMouseDown={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '0.75rem' } }}
                            />
                        ) : (
                            <Typography variant="caption" sx={{ opacity: 0.5 }}>{item.time}</Typography>
                        )
                    }
                />

                {/* 4. Action Buttons */}
                {isEditMode && (
                    <Stack
                        direction="row"
                        spacing={0.5}
                        className="item-actions"
                        sx={{ opacity: isEditing ? 1 : 0, transition: '0.2s' }}
                    >
                        {isEditing ? (
                            <IconButton
                                size="small"
                                onClick={(e) => { e.stopPropagation(); handleSave(); }}
                                sx={{ color: '#10b981' }}
                            >
                                <CheckCircle sx={{ fontSize: 18 }} />
                            </IconButton>
                        ) : (
                            <>
                                <IconButton
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                    sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#6366f1' } }}
                                >
                                    <EditIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                    sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#f43f5e' } }}
                                >
                                    <DeleteIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </>
                        )}
                    </Stack>
                )}
            </ListItemButton>
        </ListItem>
    );
};

export default SortableLessonItem;