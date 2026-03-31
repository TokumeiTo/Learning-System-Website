import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Stack, Box, Typography, 
    CircularProgress, IconButton, MenuItem
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';
import { updateCourse } from '../../api/course.api';
import type { Course } from '../../types_interfaces/course';

interface UpdateCourseModalProps {
    course: Course;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const UpdateCourseModal: React.FC<UpdateCourseModalProps> = ({ course, open, onClose, onSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Course>>({ ...course });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Sync form with course prop when opened
    useEffect(() => {
        if (open) {
            setEditForm({ ...course });
            setPreviewUrl(null);
            setSelectedFile(null);
        }
    }, [open, course]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setSubmitting(true);
        
        // Constructing FormData for the "Sync" logic
        const data = new FormData();
        data.append('title', editForm.title || '');
        data.append('description', editForm.description || '');
        data.append('status', editForm.status || 'Draft');
        data.append('category', editForm.category || '');
        data.append('badge', editForm.badge || '');
        
        if (selectedFile) {
            data.append('thumbnailFile', selectedFile);
        }

        try {
            await updateCourse(course.id, data);
            onSuccess(); // Trigger refresh in parent
            onClose();
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update course. Please check your connection.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper" disableAutoFocus>
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Update Course
                <IconButton onClick={onClose} size="small"><Close /></IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    {/* Thumbnail Preview */}
                    <Box sx={{ textAlign: 'center' }}>
                        {(previewUrl || course.thumbnail) && (
                            <Box 
                                component="img" 
                                src={previewUrl || `${import.meta.env.VITE_API_URL}${course.thumbnail}`} 
                                sx={{ width: '100%', height: 180, objectFit: 'contain', borderRadius: 2, mb: 1 }} 
                            />
                        )}
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUpload />}
                            fullWidth
                        >
                            Upload New Thumbnail
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                    </Box>

                    <TextField
                        label="Course Title"
                        fullWidth
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />

                    <TextField
                        label="Category"
                        fullWidth
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    />

                    <TextField
                        select
                        label="Status"
                        fullWidth
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    >
                        <MenuItem value="Published">Published</MenuItem>
                        <MenuItem value="Draft">Draft</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                    </TextField>

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>
                    Cancel
                </Button>
                <Button 
                    onClick={handleSave} 
                    variant="contained" 
                    disabled={submitting}
                    sx={{ px: 4, fontWeight: 800, borderRadius: 2 }}
                >
                    {submitting ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateCourseModal;