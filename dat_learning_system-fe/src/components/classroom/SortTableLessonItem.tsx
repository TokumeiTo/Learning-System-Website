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
import { motion, AnimatePresence } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Lesson } from '../../types/classroom';

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
    // Local state for inline editing
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(item.title);
    const [editTime, setEditTime] = useState(item.time);
    const [prevLocked, setPrevLocked] = useState(item.isLocked);
    const [showUnlockAnim, setShowUnlockAnim] = useState(false);

    const {
        attributes, listeners, setNodeRef, transform, transition, isDragging
    } = useSortable({
        id: item.id,
        disabled: !isEditMode || isEditing // Disable drag while typing
    });

    const style = {
        color: 'white',
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 0,
        opacity: isDragging ? 0.6 : 1,
    };

    const handleSave = async () => {
        // 1. Prevent saving if it's already in progress or title is empty
        if (!editTitle.trim()) {
            setEditTitle(item.title); // Reset to original
            setIsEditing(false);
            return;
        }

        if (editTitle.trim() !== item.title || editTime !== item.time) {
            // 2. Wrap in a try-catch to handle network errors during edit
            try {
                await onUpdate(item.id, editTitle, editTime);
            } catch (err) {
                setEditTitle(item.title); // Rollback on error
            }
        }
        setIsEditing(false);
    };

    useEffect(() => {
        // If it was locked and now it's not -> trigger animation
        if (prevLocked && !item.isLocked) {
            setShowUnlockAnim(true);
            setTimeout(() => setShowUnlockAnim(false), 2000); // Reset after anim
        }
        setPrevLocked(item.isLocked);
    }, [item.isLocked]);

    return (
        <ListItem
            ref={setNodeRef}
            style={style}
            disablePadding
            sx={{
                mb: 0.5,
                // Show action buttons only on hover when in edit mode
                '&:hover .item-actions': { opacity: 1 }
            }}
        >
            <ListItemButton
                disabled={item.isLocked && !isEditMode}
                selected={currentLessonId === item.id}
                onClick={() => !isEditing && onSelect()}
                sx={{
                    borderRadius: 2,
                    px: 1,
                    transition: '0.2s',
                    '&.Mui-disabled': {
                        opacity: 0.5,
                        cursor: 'not-allowed'
                    },
                    '&.Mui-selected': {
                        bgcolor: 'rgba(99, 102, 241, 0.15)',
                        borderRight: '3px solid #6366f1'
                    },
                }}
            >
                {/* 1. Drag Handle (Left) */}
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
                        : item.isDone ? '#10b981' : '#6366f1'
                }}>
                    <AnimatePresence mode="wait">
                        {item.isLocked && !isEditMode ? (
                            <motion.div
                                key="locked"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.2, opacity: 0, rotate: -10 }}
                            >
                                <LockIcon sx={{ fontSize: 18 }} />
                            </motion.div>
                        ) : showUnlockAnim ? (
                            <motion.div
                                key="unlocking"
                                initial={{ y: 0 }}
                                animate={{
                                    y: [0, -5, 0],
                                    color: ['#rgba(255,255,255,0.2)', '#6366f1']
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <LockOpenIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                            </motion.div>
                        ) : item.isDone ? (
                            <motion.div
                                key="done"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <CheckCircle fontSize="small" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="play"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <PlayCircle fontSize="small" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </ListItemIcon>

                {/* 3. Content (Text or Input) */}
                <ListItemText
                    primary={
                        isEditing ? (
                            <TextField
                                variant="standard" fullWidth autoFocus
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '0.875rem', fontWeight: 600 } }}
                            />
                        ) : (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'white',
                                    fontWeight: currentLessonId === item.id ? 900 : 500 // Bold if active
                                }}
                            >
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
                                onBlur={handleSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                InputProps={{ disableUnderline: true, sx: { color: 'rgb(255, 255, 255)', fontSize: '0.75rem' } }}
                            />
                        ) : (
                            <Typography variant="caption" sx={{ opacity: 0.5 }}>{item.time}</Typography>
                        )
                    }
                />

                {/* 4. Action Buttons (Right) */}
                {isEditMode && !isEditing && (
                    <Stack
                        direction="row"
                        spacing={0.5}
                        className="item-actions"
                        sx={{ opacity: 0, transition: '0.2s' }}
                    >
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
                    </Stack>
                )}
            </ListItemButton>
        </ListItem>
    );
};

export default SortableLessonItem;