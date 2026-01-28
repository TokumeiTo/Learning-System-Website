import React, { useState } from 'react';
import { 
    Box, Card, CardContent, TextField, Stack, Button, 
    IconButton, MenuItem, Select, Typography,
    Switch, FormControlLabel, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { 
    CloudUpload, Close, Timer, 
    Visibility, VisibilityOff 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Course } from '../../types/course';

interface CreateCourseCardProps {
    onSave: (course: Partial<Course>) => void;
    onCancel: () => void;
}

const CreateCourseCard: React.FC<CreateCourseCardProps> = ({ onSave, onCancel }) => {
    const [form, setForm] = useState<Partial<Course>>({
        title: '',
        category: 'Japanese',
        badge: 'Beginner',
        totalHours: 0,
        isMandatory: false,
        status: 'Draft', // Defaulting to Draft is safer
        description: ''
    });

    const handleStatusChange = (
        _event: React.MouseEvent<HTMLElement>,
        newStatus: "Published" | "Draft",
    ) => {
        if (newStatus !== null) {
            setForm({ ...form, status: newStatus });
        }
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            sx={{ width: { xs: '100%', sm: 340 } }}
        >
            <Card sx={{
                borderRadius: 6,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '2px dashed #3b82f6',
                boxShadow: '0 12px 30px rgba(59, 130, 246, 0.1)',
            }}>
                {/* Image Placeholder */}
                <Box sx={{ 
                    position: 'relative', height: 160, bgcolor: 'grey.50', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Stack spacing={1} alignItems="center">
                        <CloudUpload color="primary" sx={{ fontSize: 28 }} />
                        <Typography variant="caption" fontWeight={800} color="text.secondary">
                            THUMBNAIL
                        </Typography>
                    </Stack>
                    
                    {/* Badge Selection Overlay */}
                    <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                         <Select
                            size="small"
                            variant="standard"
                            value={form.badge}
                            onChange={(e) => setForm({ ...form, badge: e.target.value as any })}
                            disableUnderline
                            sx={{ 
                                bgcolor: 'rgba(255,255,255,0.95)', px: 1, borderRadius: 2,
                                fontSize: '0.65rem', fontWeight: 800, backdropFilter: 'blur(4px)'
                            }}
                        >
                            <MenuItem value="Beginner">Beginner</MenuItem>
                            <MenuItem value="Intermediate">Intermediate</MenuItem>
                            <MenuItem value="Advanced">Advanced</MenuItem>
                        </Select>
                    </Box>
                </Box>

                <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* Top Row: Category & Mandatory */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Select
                            size="small"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                            sx={{ height: 24, borderRadius: 2, fontSize: '0.65rem', fontWeight: 900 }}
                        >
                            <MenuItem value="Japanese">JAPANESE</MenuItem>
                            <MenuItem value="IT">IT</MenuItem>
                            <MenuItem value="English">ENGLISH</MenuItem>
                            <MenuItem value="Custom">CUSTOM</MenuItem>
                        </Select>

                        <FormControlLabel
                            control={
                                <Switch 
                                    size="small" 
                                    checked={form.isMandatory} 
                                    onChange={(e) => setForm({...form, isMandatory: e.target.checked})} 
                                />
                            }
                            label={<Typography sx={{ fontSize: '0.6rem', fontWeight: 900 }}>MANDATORY</Typography>}
                            labelPlacement="start"
                            sx={{ m: 0 }}
                        />
                    </Stack>

                    {/* Title & Description */}
                    <Box>
                        <TextField
                            placeholder="Course Title..."
                            variant="standard"
                            fullWidth
                            InputProps={{ disableUnderline: true, style: { fontWeight: 800, fontSize: '1rem' }}}
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                        <TextField
                            placeholder="Short description of the program..."
                            variant="standard"
                            fullWidth
                            multiline
                            rows={2}
                            InputProps={{ disableUnderline: true, style: { fontSize: '0.75rem', color: '#64748b' }}}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </Box>

                    {/* Status & Hours Row */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                            <Timer sx={{ fontSize: 16 }} />
                            <TextField 
                                variant="standard" 
                                type="number"
                                sx={{ width: 30 }}
                                value={form.totalHours}
                                onChange={(e) => setForm({ ...form, totalHours: Number(e.target.value) })}
                                InputProps={{ style: { fontSize: '0.75rem', fontWeight: 700 }}}
                            />
                            <Typography variant="caption" fontWeight={600}>hrs</Typography>
                        </Stack>

                        <ToggleButtonGroup
                            value={form.status}
                            exclusive
                            onChange={handleStatusChange}
                            size="small"
                            sx={{ height: 28 }}
                        >
                            <ToggleButton value="Published" sx={{ fontSize: '0.6rem', fontWeight: 700, px: 1 }}>
                                <Visibility sx={{ fontSize: 12, mr: 0.5 }} /> Live
                            </ToggleButton>
                            <ToggleButton value="Draft" sx={{ fontSize: '0.6rem', fontWeight: 700, px: 1 }}>
                                <VisibilityOff sx={{ fontSize: 12, mr: 0.5 }} /> Draft
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>

                    {/* Actions */}
                    <Stack direction="row" spacing={1} sx={{ mt: 'auto', pt: 1 }}>
                        <Button 
                            fullWidth 
                            variant="contained" 
                            onClick={() => onSave(form)}
                            sx={{ 
                                borderRadius: 2, fontWeight: 800, textTransform: 'none', 
                                bgcolor: form.status === 'Published' ? '#10b981' : '#64748b' 
                            }}
                        >
                            {form.status === 'Published' ? 'Publish Now' : 'Save as Draft'}
                        </Button>
                        <IconButton onClick={onCancel} size="small" sx={{ bgcolor: 'grey.100', borderRadius: 2 }}>
                            <Close fontSize="small" />
                        </IconButton>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CreateCourseCard;