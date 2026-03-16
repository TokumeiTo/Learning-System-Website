import { useEffect, useState, useCallback } from 'react';
import {
    Box, Accordion, AccordionSummary, AccordionDetails, Typography,
    CircularProgress, Button, Stack, Paper, TextField, Divider, IconButton
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Add as AddIcon,
    AccessTime as TimeIcon,
    PersonOutline as UserIcon,
    AssignmentOutlined as AssignmentIcon,
    InsertDriveFileOutlined as FileIcon,
    DeleteOutline as DeleteIcon // Added Delete Icon
} from '@mui/icons-material';
import dayjs from 'dayjs';

// Added deleteClassworkItem and deleteClassworkTopic to your imports
import {
    fetchCourseClasswork,
    createClassworkTopic,
    deleteClassworkTopic,
    deleteClassworkItem
} from '../../api/classwork.api';
import type { ClassworkTopic } from '../../types_interfaces/classwork';
import ClassworkDetailModal from './ClassworkDetailModal';
import CreateItemInline from './CreateClassworkItem';

interface Props {
    courseId: string;
    isEditMode: boolean;
}

const ClassworkTab = ({ courseId, isEditMode }: Props) => {
    const [topics, setTopics] = useState<ClassworkTopic[]>([]);
    const [loading, setLoading] = useState(true);

    // Topic Creation State
    const [isAddingTopic, setIsAddingTopic] = useState(false);
    const [topicTitle, setTopicTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // NEW: Deletion State to handle loading feedback
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Detail Modal State
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const loadData = useCallback(async () => {
        try {
            const data = await fetchCourseClasswork(courseId);
            setTopics(data);
        } catch (error) {
            console.error("Failed to load classwork", error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleCreateTopic = async () => {
        if (!topicTitle.trim()) return;
        setIsSaving(true);
        try {
            await createClassworkTopic({ title: topicTitle.trim(), courseId });
            setTopicTitle('');
            setIsAddingTopic(false);
            await loadData();
        } catch (e) {
            console.error("Topic creation failed", e);
        } finally {
            setIsSaving(false);
        }
    };

    // --- NEW: DELETE HANDLERS ---
    const handleDeleteTopic = async (e: React.MouseEvent, topicId: string, title: string) => {
        e.stopPropagation(); // Stop accordion from toggling
        if (!window.confirm(`Delete "${title}"? This will remove all items and student submissions inside it.`)) return;

        setDeletingId(topicId);
        try {
            await deleteClassworkTopic(topicId);
            await loadData();
        } catch (error) {
            console.error("Delete topic failed", error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteItem = async (itemId: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete the item "${title}"?`)) return;

        setDeletingId(itemId);
        try {
            await deleteClassworkItem(itemId);
            await loadData();
        } catch (error) {
            console.error("Delete item failed", error);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={24} sx={{ color: '#818cf8' }} />
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1 }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, px: 1 }}>
                <Typography variant="overline" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5 }}>
                    {isEditMode ? 'MANAGEMENT' : 'COURSE CONTENT'}
                </Typography>
                {(isSaving || deletingId) && <CircularProgress size={14} sx={{ color: '#818cf8' }} />}
            </Stack>

            {/* Level 1: Topic Accordions */}
            <Box sx={{ flexGrow: 1 }}>
                {topics.map((topic) => (
                    <Accordion
                        key={topic.id}
                        elevation={0}
                        disableGutters
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px !important',
                            mb: 1.5,
                            '&:before': { display: 'none' }
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#818cf8' }} />}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', pr: 1 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#818cf8' }}>
                                    {topic.title}
                                </Typography>

                                {isEditMode && (
                                    <IconButton
                                        size="small"
                                        disabled={deletingId === topic.id}
                                        onClick={(e) => handleDeleteTopic(e, topic.id, topic.title)}
                                        sx={{ color: 'rgba(255,255,255,0.2)', '&:hover': { color: '#f87171', bgcolor: 'rgba(248, 113, 113, 0.1)' } }}
                                    >
                                        {deletingId === topic.id ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon sx={{ fontSize: 18 }} />}
                                    </IconButton>
                                )}
                            </Stack>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
                            <Stack spacing={1}>
                                {topic.items.map((item) => (
                                    <Accordion
                                        key={item.id}
                                        elevation={0}
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.03)',
                                            borderRadius: '8px !important',
                                            '&:before': { display: 'none' },
                                            border: '1px solid rgba(255,255,255,0.03)'
                                        }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.3)' }} />}>
                                            <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                                                <Box sx={{
                                                    p: 1, borderRadius: 1.5,
                                                    bgcolor: item.itemType === 'Assignment' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(129, 140, 248, 0.1)',
                                                    color: item.itemType === 'Assignment' ? '#f87171' : '#818cf8',
                                                    display: 'flex'
                                                }}>
                                                    {item.itemType === 'Assignment' ? <AssignmentIcon sx={{ fontSize: 20 }} /> : <FileIcon sx={{ fontSize: 20 }} />}
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.title}</Typography>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <TimeIcon sx={{ fontSize: 12 }} /> {dayjs(item.createdAt).format('DD MMM')}
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ px: 3, pb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2, whiteSpace: 'pre-wrap' }}>
                                                {item.description || "No instructions provided."}
                                            </Typography>

                                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 1.5 }} />

                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <UserIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.2)' }} />
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                                        Posted by <span style={{ color: '#818cf8', fontWeight: 600 }}>{item.createdByName || 'Instructor'}</span>
                                                    </Typography>
                                                </Box>

                                                <Stack direction="row" spacing={1}>
                                                    {isEditMode && (
                                                        <Button
                                                            size="small"
                                                            disabled={deletingId === item.id}
                                                            onClick={() => handleDeleteItem(item.id, item.title)}
                                                            sx={{ color: 'rgba(255,255,255,0.3)', textTransform: 'none', '&:hover': { color: '#f87171' } }}
                                                        >
                                                            {deletingId === item.id ? <CircularProgress size={14} color="inherit" /> : "Remove"}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() => setSelectedItem(item)}
                                                        sx={{
                                                            bgcolor: 'rgba(129, 140, 248, 0.1)',
                                                            color: '#818cf8',
                                                            boxShadow: 'none',
                                                            textTransform: 'none',
                                                            fontSize: '0.75rem',
                                                            '&:hover': { bgcolor: '#818cf8', color: 'white' }
                                                        }}
                                                    >
                                                        {item.itemType === 'Assignment' ? 'View Assignment' : 'View Material'}
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}

                                {isEditMode && (
                                    <CreateItemInline topicId={topic.id} onItemCreated={loadData} />
                                )}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            {/* Add Topic Section */}
            {isEditMode && (
                <Box sx={{ mt: 1, px: 1 }}>
                    {isAddingTopic ? (
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(129, 140, 248, 0.05)', borderRadius: 3, border: '1px solid #818cf8' }}>
                            <Stack spacing={2}>
                                <TextField
                                    autoFocus fullWidth size="small" placeholder="New Topic Title..."
                                    value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} variant="standard"
                                    InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '0.95rem', fontWeight: 600 } }}
                                />
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button size="small" onClick={() => setIsAddingTopic(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Cancel</Button>
                                    <Button size="small" variant="contained" onClick={handleCreateTopic} sx={{ borderRadius: 1.5, bgcolor: '#818cf8', textTransform: 'none', px: 3 }}>Create</Button>
                                </Stack>
                            </Stack>
                        </Paper>
                    ) : (
                        <Button
                            fullWidth startIcon={<AddIcon />}
                            onClick={() => setIsAddingTopic(true)}
                            sx={{
                                py: 1.2, border: '1px dashed rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.4)', textTransform: 'none', borderRadius: 3,
                                fontSize: '0.8rem', fontWeight: 600,
                                '&:hover': { border: '1px dashed #818cf8', color: '#818cf8', bgcolor: 'rgba(129, 140, 248, 0.05)' }
                            }}
                        >
                            ADD NEW TOPIC
                        </Button>
                    )}
                </Box>
            )}

            {/* Detail Modal */}
            {selectedItem && (
                <ClassworkDetailModal
                    item={selectedItem}
                    open={Boolean(selectedItem)}
                    onClose={() => setSelectedItem(null)}
                    isEditMode={isEditMode}
                    onRefresh={loadData}
                />
            )}
        </Box>
    );
};

export default ClassworkTab;