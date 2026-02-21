import React, { useState, useRef } from 'react';
import {
    Box, Card, CardContent, TextField, Stack, Button,
    IconButton, MenuItem, Select, Typography,
    Switch, FormControlLabel, ToggleButton, ToggleButtonGroup,
    alpha, Autocomplete
} from '@mui/material';
import {
    CloudUpload, Close, Timer,
    Visibility, VisibilityOff, Delete
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreateCourseInputs } from '../../types/course';

interface CreateCourseCardProps {
    onSave: (course: FormData) => Promise<void> | void; // Changed to allow Promise
    onCancel: () => void;
}

const CreateCourseCard: React.FC<CreateCourseCardProps> = ({ onSave, onCancel }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    // NEW: Loading and Validation States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({ title: false, description: false });

    const [form, setForm] = useState<CreateCourseInputs>({
        title: '',
        category: 'Japanese',
        badge: 'Beginner',
        totalHours: 0,
        isMandatory: false,
        status: 'Draft',
        description: '',
        thumbnailFile: null
    });

    const handleFileProcessing = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file");
            return;
        }
        if (preview) URL.revokeObjectURL(preview);
        const url = URL.createObjectURL(file);
        setPreview(url);
        setForm(prev => ({ ...prev, thumbnailFile: file }));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragging(true);
        else if (e.type === 'dragleave') setDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (e.dataTransfer.files?.[0]) handleFileProcessing(e.dataTransfer.files[0]);
    };

    const handleSave = async () => {
        // 1. Create safe local copies (removes the 'undefined' risk)
        const title = form.title || '';
        const description = form.description || '';
        const badge = form.badge || 'Beginner';
        const category = form.category || 'Japanese';
        const status = form.status || 'Draft';

        // 2. Validate using local variables
        const hasTitleError = !title.trim();
        const hasDescError = !description.trim();

        setErrors({ title: hasTitleError, description: hasDescError });
        if (hasTitleError || hasDescError) return;

        setIsSubmitting(true);

        try {
            const data = new FormData();

            // 3. Append to FormData (using the safe strings)
            if (form.thumbnailFile) {
                data.append('ThumbnailFile', form.thumbnailFile);
            }

            data.append('Title', title);
            data.append('Description', description);
            data.append('Badge', badge);
            data.append('Category', category);
            data.append('Status', status);
            data.append('TotalHours', String(form.totalHours ?? 0));
            data.append('IsMandatory', String(form.isMandatory ?? false));

            await onSave(data);
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, margin: 'auto' }}
            sx={{ width: { xs: '100%', sm: 340 } }}
        >
            <Card sx={{
                borderRadius: 6,
                border: dragging ? `2px solid #3b82f6` : '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
                boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Image Upload Area */}
                <Box
                    onDragOver={handleDrag}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !preview && fileInputRef.current?.click()}
                    sx={{
                        height: 180,
                        position: 'relative',
                        bgcolor: dragging ? alpha('#3b82f6', 0.1) : 'grey.50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: preview ? 'default' : 'pointer',
                        overflow: 'hidden'
                    }}
                >
                    <input type="file" ref={fileInputRef} hidden accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileProcessing(e.target.files[0])} />

                    <AnimatePresence mode="wait">
                        {preview ? (
                            <Box key="preview" sx={{ width: '100%', height: '100%', position: 'relative' }}>
                                <Box component="img" src={preview} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Stops file explorer from opening
                                        setPreview(null);
                                        setForm(p => ({ ...p, thumbnailFile: null }));
                                    }}
                                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
                                >
                                    <Delete fontSize="small" color="error" />
                                </IconButton>
                            </Box>
                        ) : (
                            <Stack key="placeholder" spacing={1} alignItems="center">
                                <CloudUpload
                                    sx={{
                                        fontSize: 32,
                                        color: dragging ? "primary.main" : "text.disabled",
                                        transition: "color 0.3s ease"
                                    }}
                                />
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                                    {dragging ? "DROP TO UPLOAD" : "THUMBNAIL"}
                                </Typography>
                            </Stack>
                        )}
                    </AnimatePresence>

                    {/* Badge Selector Overlay - STOP PROPAGATION FIXED */}
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}
                    >
                        <Autocomplete
                            freeSolo
                            size="small"
                            options={['Beginner', 'Intermediate', 'Advanced', 'N1', 'N2', 'N3']}
                            value={form.badge}
                            slotProps={{
                                clearIndicator: {
                                    sx: { visibility: 'visible' } // Forces it to stay visible
                                }
                            }}
                            onInputChange={(_, newValue) => setForm({ ...form, badge: newValue })}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Badge..."
                                    variant="standard"
                                    InputProps={{ ...params.InputProps, disableUnderline: true }}
                                    sx={{
                                        bgcolor: 'background.default', px: 1, py: 0.3, borderRadius: 2,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: 200,
                                        '& .MuiInputBase-input': {
                                            fontSize: '0.65rem', fontWeight: 800, height: 20,
                                            color: 'primary.main', textTransform: 'uppercase'
                                        }
                                    }}
                                />
                            )}
                        />
                    </Box>
                </Box>

                <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Select
                            size="small"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            sx={{ borderRadius: 2, fontSize: '0.65rem', fontWeight: 900, height: 28 }}
                        >
                            <MenuItem value="Japanese">JAPANESE</MenuItem>
                            <MenuItem value="IT">IT</MenuItem>
                            <MenuItem value="English">ENGLISH</MenuItem>
                        </Select>

                        <FormControlLabel
                            control={<Switch size="small" checked={form.isMandatory} onChange={(e) => setForm({ ...form, isMandatory: e.target.checked })} />}
                            label={<Typography sx={{ fontSize: '0.6rem', fontWeight: 900 }}>MANDATORY</Typography>}
                            labelPlacement="start"
                        />
                    </Stack>

                    <Box>
                        <TextField
                            placeholder="Course Title..."
                            variant="standard"
                            fullWidth
                            error={errors.title}
                            helperText={errors.title ? "Title is required" : ""}
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            InputProps={{ disableUnderline: true, style: { fontWeight: 800, fontSize: '1.1rem' } }}
                        />
                        <TextField
                            placeholder="What will students learn?"
                            variant="standard"
                            fullWidth
                            multiline
                            rows={2}
                            error={errors.description}
                            helperText={errors.description ? "Description is required" : ""}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            InputProps={{ disableUnderline: true, style: { fontSize: '0.8rem', color: '#64748b' } }}
                        />
                    </Box>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <TextField
                                variant="standard"
                                type="number"
                                sx={{ width: 35 }}
                                value={form.totalHours}
                                onChange={(e) => setForm({ ...form, totalHours: Number(e.target.value) })}
                                InputProps={{ disableUnderline: true, style: { fontSize: '0.8rem', fontWeight: 800 } }}
                            />
                            <Typography variant="caption" fontWeight={700} color="text.secondary">hrs</Typography>
                        </Stack>

                        <ToggleButtonGroup
                            value={form.status}
                            exclusive
                            size="small"
                            onChange={(_e, val) => val && setForm({ ...form, status: val })}
                            sx={{ height: 26 }}
                        >
                            <ToggleButton value="Published" sx={{ fontSize: '0.6rem', fontWeight: 800 }}>
                                <Visibility sx={{ fontSize: 12, mr: 0.5 }} /> Live
                            </ToggleButton>
                            <ToggleButton value="Draft" sx={{ fontSize: '0.6rem', fontWeight: 800 }}>
                                <VisibilityOff sx={{ fontSize: 12, mr: 0.5 }} /> Draft
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSave}
                            disabled={isSubmitting} // Disable while loading
                            sx={{
                                borderRadius: 2.5, fontWeight: 800, textTransform: 'none',
                                bgcolor: form.status === 'Published' ? '#10b981' : 'text.primary',
                                '&:hover': { bgcolor: form.status === 'Published' ? '#059669' : 'gray' }
                            }}
                        >
                            {isSubmitting
                                ? (form.status === 'Published' ? 'Publishing...' : 'Saving Draft...')
                                : (form.status === 'Published' ? 'Create & Publish' : 'Save as Draft')
                            }
                        </Button>
                        <IconButton onClick={onCancel} disabled={isSubmitting} sx={{ bgcolor: 'red', borderRadius: 2.5 }}>
                            <Close fontSize="small" />
                        </IconButton>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CreateCourseCard;