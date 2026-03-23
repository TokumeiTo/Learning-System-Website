import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, FormControlLabel, Switch, Typography, Stack, Paper, IconButton, FormHelperText,
    LinearProgress
} from '@mui/material';
import { CloudUpload, PictureAsPdf, PhotoCamera, Close } from '@mui/icons-material';
import type { EBook } from '../../types_interfaces/library';

interface EBookFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: FormData) => void;
    initialData?: EBook | null;
    uploadProgress?: number; // New prop to receive progress from parent
    isUploading?: boolean;   // New prop to show loading state
}

const EBookFormDialog: React.FC<EBookFormProps> = ({
    open, onClose, onSave, initialData, uploadProgress = 0, isUploading = false
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [previewImg, setPreviewImg] = useState<string>('/No_Thumbnail.svg');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (open) {
            setErrors({});
            if (initialData) {
                setTitle(initialData.title);
                setDescription(initialData.description || '');
                setAuthor(initialData.author);
                setCategory(initialData.category);
                setIsActive(initialData.isActive ?? true);
                setPreviewImg(`${import.meta.env.VITE_API_URL}${initialData.thumbnailUrl}` || '/No_Thumbnail.svg');
            } else {
                setTitle('');
                setDescription('');
                setAuthor('');
                setCategory('');
                setIsActive(true);
                setPreviewImg('/No_Thumbnail.svg');
            }
            setThumbFile(null);
            setPdfFile(null);
        }
    }, [initialData, open]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumb' | 'pdf') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Clear errors specifically for files when picked
        const field = type === 'thumb' ? 'ThumbnailFile' : 'EBookFile';
        setErrors(prev => ({ ...prev, [field]: '' }));

        if (type === 'thumb') {
            setThumbFile(file);
            setPreviewImg(URL.createObjectURL(file));
        } else {
            setPdfFile(file);
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        const MAX_SIZE = 400 * 1024 * 1024; // 400MB

        if (!title.trim()) newErrors.title = "Book title is required.";
        if (!author.trim()) newErrors.author = "Author name is required.";
        if (!category.trim()) newErrors.category = "Category is required.";

        // Check Thumbnail
        if (!thumbFile && !initialData?.thumbnailUrl) {
            newErrors.ThumbnailFile = "Cover image is required.";
        }

        // Check PDF + Size
        if (!pdfFile && !initialData?.fileUrl) {
            newErrors.EBookFile = "PDF file is required.";
        } else if (pdfFile && pdfFile.size > MAX_SIZE) {
            newErrors.EBookFile = "File is too large. Maximum size is 400MB.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Description', description || '');
        formData.append('Author', author);
        formData.append('Category', category);
        formData.append('IsActive', isActive.toString());
        formData.append('FileName', pdfFile?.name || initialData?.fileName || '');

        if (thumbFile) formData.append('ThumbnailFile', thumbFile);
        if (pdfFile) formData.append('EBookFile', pdfFile);
        if (initialData?.thumbnailUrl) formData.append('ThumbnailUrl', initialData.thumbnailUrl);
        if (initialData?.fileUrl) formData.append('FileUrl', initialData.fileUrl);

        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={isUploading ? undefined : onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 900 }}>
                {initialData ? 'Edit Resource' : 'Add New Library Resource'}
            </DialogTitle>

            {/* UPLOAD PROGRESS BAR */}
            {isUploading && (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 6 }} />
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 0.5, fontWeight: 700, color: 'primary.main' }}>
                        Uploading: {uploadProgress}%
                    </Typography>
                </Box>
            )}

            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2, bgcolor: isActive ? '#75f99d' : '#fff1f2', borderColor: isActive ? '#bbf7d0' : '#fecaca' }}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={800} color='primary'>Visibility Status</Typography>
                            <Typography variant="caption" color="gray">
                                {isActive ? "Students can see and study this book." : "Hidden from student library (Draft mode)."}
                            </Typography>
                        </Box>
                        <Switch
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            color="success"
                        />
                    </Paper>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        {/* Thumbnail Picker */}
                        <Paper variant="outlined" sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: 'background.paper', borderColor: errors.ThumbnailFile ? 'error.main' : 'divider' }}>
                            <Typography variant="caption" fontWeight={700} color={errors.ThumbnailFile ? 'error.main' : 'textSecondary'} display="block">COVER IMAGE</Typography>
                            <Box sx={{ position: 'relative', height: 140, display: 'flex', justifyContent: 'center', my: 1 }}>
                                <img src={previewImg} alt="Preview" style={{ height: '100%', borderRadius: '4px', objectFit: 'cover' }} />
                            </Box>
                            <Button component="label" variant="outlined" size="small" color={errors.ThumbnailFile ? 'error' : 'primary'} startIcon={<PhotoCamera />} disabled={isUploading}>
                                Change Cover
                                <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'thumb')} />
                            </Button>
                            {errors.ThumbnailFile && <FormHelperText error sx={{ textAlign: 'center' }}>{errors.ThumbnailFile}</FormHelperText>}
                        </Paper>

                        {/* PDF Picker */}
                        <Paper variant="outlined" sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: 'background.paper', borderColor: errors.EBookFile ? 'error.main' : 'divider' }}>
                            <Typography variant="caption" fontWeight={700} color={errors.EBookFile ? 'error.main' : 'textSecondary'} display="block">PDF FILE</Typography>
                            <Box sx={{ height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <PictureAsPdf color={errors.EBookFile ? "error" : (pdfFile || initialData?.fileUrl ? "primary" : "disabled")} sx={{ fontSize: 40 }} />
                                <Typography variant="caption" noWrap sx={{ maxWidth: '100%', mt: 1, fontWeight: 600, color: 'text.default' }}>
                                    {pdfFile ? pdfFile.name : (initialData?.fileName || "No file selected")}
                                </Typography>
                            </Box>
                            <Button variant='outlined' component="label" size="small" color={errors.EBookFile ? 'error' : 'primary'} startIcon={<CloudUpload />} disabled={isUploading}>
                                {pdfFile ? "Change PDF" : "Select PDF"}
                                <input type="file" hidden accept="application/pdf" onChange={(e) => handleFileChange(e, 'pdf')} />
                            </Button>
                            {errors.EBookFile && <FormHelperText error sx={{ textAlign: 'center' }}>{errors.EBookFile}</FormHelperText>}
                        </Paper>
                    </Stack>

                    <TextField label="Book Title" fullWidth value={title} error={!!errors.title} helperText={errors.title} disabled={isUploading}
                        onChange={(e) => { setTitle(e.target.value); setErrors({ ...errors, title: '' }); }} />

                    <Stack direction="row" spacing={2}>
                        <TextField label="Author" sx={{ flex: 2 }} value={author} error={!!errors.author} helperText={errors.author} disabled={isUploading}
                            onChange={(e) => { setAuthor(e.target.value); setErrors({ ...errors, author: '' }); }} />
                        <TextField label="Category" sx={{ flex: 1 }} value={category} error={!!errors.category} helperText={errors.category} disabled={isUploading}
                            onChange={(e) => { setCategory(e.target.value); setErrors({ ...errors, category: '' }); }} />
                    </Stack>

                    <TextField fullWidth multiline rows={2} label="Description" value={description} disabled={isUploading}
                        onChange={(e) => setDescription(e.target.value)} />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} color="inherit" disabled={isUploading}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={isUploading} sx={{ fontWeight: 800, px: 4 }}>
                    {isUploading ? 'Uploading...' : initialData ? 'Update' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EBookFormDialog;