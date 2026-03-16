import { useState, useRef } from 'react';
import { 
    Box, Paper, Stack, TextField, Button, 
    ToggleButtonGroup, ToggleButton, Typography, Divider, IconButton
} from '@mui/material';
import { 
    AssignmentOutlined as AssignmentIcon, 
    InsertDriveFileOutlined as FileIcon,
    AddLink as LinkIcon,
    Delete as DeleteIcon,
    AttachFile as AttachIcon,
    Event as EventIcon,
    Score as ScoreIcon
} from '@mui/icons-material';
import { createClassworkItem } from '../../api/classwork.api';
import type { CreateResourcePayload, CreateItemPayload } from '../../types_interfaces/classwork';
import fileToBase64 from '../../utils/fileToBase64';

interface Props {
    topicId: string;
    onItemCreated: () => void;
}

const CreateItemInline = ({ topicId, onItemCreated }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Core State
    const [type, setType] = useState<'Assignment' | 'Resource'>('Assignment');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    // Assignment Specific State
    const [dueDate, setDueDate] = useState('');
    const [maxPoints, setMaxPoints] = useState('100');

    // Resources State
    const [resourceUrl, setResourceUrl] = useState('');
    const [tempResources, setTempResources] = useState<CreateResourcePayload[]>([]);

    const addLinkResource = () => {
        if (!resourceUrl.trim()) return;
        
        const newRes: CreateResourcePayload = {
            displayName: resourceUrl.split('/').pop() || 'Link', // Use end of URL as name
            body: resourceUrl.trim(),
            resourceType: 'Link'
        };
        
        setTempResources([...tempResources, newRes]);
        setResourceUrl('');
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await fileToBase64(file);
            const newRes: CreateResourcePayload = {
                displayName: file.name,
                body: base64,
                resourceType: 'File'
            };
            setTempResources([...tempResources, newRes]);
        } catch (err) {
            console.error("File conversion failed", err);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSave = async () => {
        if (!title.trim()) return;
        setLoading(true);
        try {
            const payload: CreateItemPayload = {
                topicId,
                title: title.trim(),
                description: description.trim(),
                itemType: type,
                maxPoints: type === 'Assignment' ? Number(maxPoints) : 0,
                dueDate: type === 'Assignment' && dueDate ? new Date(dueDate).toISOString() : undefined,
                resources: tempResources
            };
            await createClassworkItem(payload);
            resetForm();
            onItemCreated();
        } catch (e) {
            console.error("Failed to create item", e);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setMaxPoints('100');
        setTempResources([]);
        setResourceUrl('');
        setIsAdding(false);
    };

    if (!isAdding) return (
        <Box sx={{ p: 1, textAlign: 'center' }}>
            <Button 
                size="small" 
                onClick={() => setIsAdding(true)} 
                sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none', fontSize: '0.75rem', '&:hover': { color: '#818cf8' } }}
            >
                + Add to topic
            </Button>
        </Box>
    );

    return (
        <Paper elevation={0} sx={{ m: 1, p: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(129, 140, 248, 0.2)', borderRadius: 3 }}>
            <Stack spacing={2}>
                <ToggleButtonGroup
                    value={type} exclusive fullWidth size="small"
                    onChange={(_, val) => val && setType(val)}
                    sx={{ mb: 1, '& .MuiToggleButton-root': { color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.1)', '&.Mui-selected': { color: '#818cf8', bgcolor: 'rgba(129, 140, 248, 0.1)' } } }}
                >
                    <ToggleButton value="Assignment"><AssignmentIcon sx={{ fontSize: 16, mr: 1 }} /> Assignment</ToggleButton>
                    <ToggleButton value="Resource"><FileIcon sx={{ fontSize: 16, mr: 1 }} /> Resource</ToggleButton>
                </ToggleButtonGroup>

                <TextField
                    placeholder={type === 'Assignment' ? "Assignment Title..." : "Resource Title..."}
                    variant="standard" fullWidth value={title} onChange={(e) => setTitle(e.target.value)}
                    InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '0.95rem', fontWeight: 600 } }}
                />

                <TextField
                    placeholder={type === 'Assignment' ? "Instructions for students..." : "Brief description..."}
                    multiline rows={2} variant="standard" fullWidth value={description} onChange={(e) => setDescription(e.target.value)}
                    InputProps={{ disableUnderline: true, sx: { color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' } }}
                />

                {type === 'Assignment' && (
                    <Stack direction="row" spacing={2} sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                <EventIcon sx={{ fontSize: 14 }} /> Due Date
                            </Typography>
                            <TextField 
                                type="date" size="small" fullWidth variant="standard"
                                value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                                InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '0.8rem' } }}
                                inputProps={{ style: { colorScheme: 'dark' } }}
                            />
                        </Box>
                        <Box sx={{ width: 100 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                <ScoreIcon sx={{ fontSize: 14 }} /> Points
                            </Typography>
                            <TextField 
                                type="number" size="small" fullWidth variant="standard"
                                value={maxPoints} onChange={(e) => setMaxPoints(e.target.value)}
                                InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '0.8rem' } }}
                            />
                        </Box>
                    </Stack>
                )}

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                <Box>
                    <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 700, display: 'block', mb: 1 }}>ATTACHMENTS</Typography>
                    
                    {tempResources.map((res, i) => (
                        <Stack key={i} direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5, bgcolor: 'rgba(255,255,255,0.03)', p: 0.5, borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {res.resourceType === 'File' ? '📄 ' : '🔗 '}{res.displayName}
                            </Typography>
                            <IconButton size="small" onClick={() => setTempResources(tempResources.filter((_, idx) => idx !== i))}>
                                <DeleteIcon sx={{ fontSize: 14, color: '#f87171' }} />
                            </IconButton>
                        </Stack>
                    ))}
                    
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} alignItems="center">
                        <TextField 
                            placeholder="Add Link URL..." size="small" variant="standard" fullWidth
                            value={resourceUrl} 
                            onChange={(e) => setResourceUrl(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addLinkResource()}
                            InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '0.75rem', bgcolor: 'rgba(255,255,255,0.05)', px: 1, borderRadius: 1 } }}
                        />
                        <IconButton size="small" onClick={addLinkResource} sx={{ color: '#4ade80' }}><LinkIcon sx={{ fontSize: 18 }} /></IconButton>
                        
                        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 0.5 }} />
                        
                        <input type="file" hidden ref={fileInputRef} onChange={handleFileSelect} />
                        <IconButton size="small" onClick={() => fileInputRef.current?.click()} sx={{ color: '#818cf8' }}>
                            <AttachIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Stack>
                </Box>

                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 1 }}>
                    <Button size="small" onClick={resetForm} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Cancel</Button>
                    <Button 
                        size="small" variant="contained" onClick={handleSave}
                        disabled={!title.trim() || loading}
                        sx={{ bgcolor: '#818cf8', borderRadius: 2, textTransform: 'none', px: 4, fontWeight: 700 }}
                    >
                        {loading ? "Posting..." : `Post ${type}`}
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default CreateItemInline;