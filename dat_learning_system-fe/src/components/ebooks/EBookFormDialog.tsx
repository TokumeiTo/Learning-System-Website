import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Switch, Typography, Stack, Paper, IconButton,
    LinearProgress, alpha, useTheme, FormHelperText
} from '@mui/material';
import { CloudUpload, PictureAsPdf, PhotoCamera, Close, CheckCircle } from '@mui/icons-material';
import type { EBook } from '../../types_interfaces/library';

interface EBookFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: FormData) => void;
    initialData?: EBook | null;
    uploadProgress?: number;
    isUploading?: boolean;
}

const EBookFormDialog: React.FC<EBookFormProps> = ({
    open, onClose, onSave, initialData, uploadProgress = 0, isUploading = false
}) => {
    const theme = useTheme();
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
                setTitle(''); setDescription(''); setAuthor(''); setCategory(''); setIsActive(true);
                setPreviewImg('/No_Thumbnail.svg');
            }
            setThumbFile(null); setPdfFile(null);
        }
    }, [initialData, open]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumb' | 'pdf') => {
        const file = e.target.files?.[0];
        if (!file) return;
        setErrors(prev => ({ ...prev, [type === 'thumb' ? 'ThumbnailFile' : 'EBookFile']: '' }));
        if (type === 'thumb') {
            setThumbFile(file);
            setPreviewImg(URL.createObjectURL(file));
        } else {
            setPdfFile(file);
        }
    };

    // RESTORED: Validation Logic
    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        const MAX_SIZE = 400 * 1024 * 1024;

        if (!title.trim()) newErrors.title = "Book title is required.";
        if (!author.trim()) newErrors.author = "Author name is required.";
        if (!category.trim()) newErrors.category = "Category is required.";

        if (!thumbFile && !initialData?.thumbnailUrl) {
            newErrors.ThumbnailFile = "Cover image is required.";
        }

        if (!pdfFile && !initialData?.fileUrl) {
            newErrors.EBookFile = "PDF file is required.";
        } else if (pdfFile && pdfFile.size > MAX_SIZE) {
            newErrors.EBookFile = "File is too large (Max 400MB).";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const formData = new FormData();

        // 1. Basic Fields
        formData.append('Title', title.trim());
        formData.append('Description', description || '');
        formData.append('Author', author.trim());
        formData.append('Category', category.trim());

        // 2. Boolean Handling (Using 1/0 is more robust for multipart)
        formData.append('IsActive', isActive ? "true" : "false");

        // 3. File Metadata
        // Send the existing filename if no new file is picked
        formData.append('FileName', pdfFile?.name || initialData?.fileName || '');

        // 4. Conditional File Uploads
        // ONLY append the file if a NEW one was selected. 
        // Do not append null/undefined as it can confuse the Model Binder.
        if (thumbFile) {
            formData.append('ThumbnailFile', thumbFile);
        }

        if (pdfFile) {
            formData.append('EBookFile', pdfFile);
        }

        // 5. URL References (Required for your "Manual Sync" logic in the Controller)
        if (initialData?.thumbnailUrl) {
            formData.append('ThumbnailUrl', initialData.thumbnailUrl);
        }
        if (initialData?.fileUrl) {
            formData.append('FileUrl', initialData.fileUrl);
        }

        onSave(formData);
    };

    return (
        <Dialog
            open={open}
            onClose={isUploading ? undefined : onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: '24px' } }}
        >
            <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h5" fontWeight={900}>
                    {initialData ? 'Edit Resource' : 'Add New Library Resource'}
                </Typography>
                {!isUploading && (
                    <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>

            {isUploading && (
                <Box sx={{ width: '100%', px: 0.5, py: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{ height: 10, borderRadius: 5, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                    />
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, fontWeight: 800, color: 'primary.main' }}>
                        UPLOADING RESOURCE: {uploadProgress}%
                    </Typography>
                </Box>
            )}

            <DialogContent dividers sx={{ p: 4 }}>
                <Stack spacing={4}>
                    <Paper elevation={0} sx={{
                        p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderRadius: '16px',
                        bgcolor: isActive ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.error.main, 0.05),
                        border: '1px solid',
                        borderColor: isActive ? 'success.light' : 'error.light',
                    }}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={800} color={isActive ? "success.dark" : "error.dark"}>
                                {isActive ? "Live in Library" : "Hidden (Draft)"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {isActive ? "Students can view this." : "Only admins can see this."}
                            </Typography>
                        </Box>
                        <Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} color="success" />
                    </Paper>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                        {/* Thumbnail Picker */}
                        <Paper variant="outlined" sx={{
                            flex: 1, p: 2, borderRadius: '20px', textAlign: 'center',
                            borderColor: errors.ThumbnailFile ? 'error.main' : 'divider'
                        }}>
                            <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: 1, color: 'text.secondary' }}>COVER PREVIEW</Typography>
                            <Box sx={{ position: 'relative', height: 160, my: 2, borderRadius: '12px', overflow: 'hidden', bgcolor: 'action.hover', border: '1px dashed', borderColor: errors.ThumbnailFile ? 'error.main' : 'divider' }}>
                                <img src={previewImg} alt="Preview" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                                {(thumbFile || initialData?.thumbnailUrl) && <CheckCircle color="success" sx={{ position: 'absolute', top: 8, right: 8 }} />}
                            </Box>
                            <Button component="label" variant="contained" size="small" disableElevation sx={{ borderRadius: '8px' }} startIcon={<PhotoCamera />}>
                                Choose Cover
                                <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'thumb')} />
                            </Button>
                            {errors.ThumbnailFile && <FormHelperText error sx={{ textAlign: 'center' }}>{errors.ThumbnailFile}</FormHelperText>}
                        </Paper>

                        {/* PDF Picker */}
                        <Paper variant="outlined" sx={{
                            flex: 1.5, p: 2, borderRadius: '20px', textAlign: 'center',
                            borderColor: errors.EBookFile ? 'error.main' : 'divider',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center'
                        }}>
                            <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: 1, color: 'text.secondary' }}>PDF DOCUMENT</Typography>
                            <Box sx={{ my: 2, p: 3, borderRadius: '12px', bgcolor: alpha(theme.palette.primary.main, 0.04), border: '1px dashed', borderColor: errors.EBookFile ? 'error.main' : alpha(theme.palette.primary.main, 0.2) }}>
                                <PictureAsPdf sx={{ fontSize: 48, color: pdfFile || initialData?.fileUrl ? 'primary.main' : 'text.disabled', mb: 1 }} />
                                <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 200, mx: 'auto' }}>
                                    {pdfFile ? pdfFile.name : (initialData?.fileName || "Select E-Book File")}
                                </Typography>
                            </Box>
                            <Button component="label" variant="outlined" size="small" sx={{ borderRadius: '8px', borderWidth: 2 }} startIcon={<CloudUpload />}>
                                {pdfFile ? "Change Document" : "Upload PDF"}
                                <input type="file" hidden accept="application/pdf" onChange={(e) => handleFileChange(e, 'pdf')} />
                            </Button>
                            {errors.EBookFile && <FormHelperText error sx={{ textAlign: 'center' }}>{errors.EBookFile}</FormHelperText>}
                        </Paper>
                    </Stack>

                    <Stack spacing={2.5}>
                        <TextField label="Book Title" fullWidth variant="filled" value={title} error={!!errors.title} helperText={errors.title} onChange={(e) => setTitle(e.target.value)} InputProps={{ sx: { borderRadius: '12px', fontWeight: 700 } }} />
                        <Stack direction="row" spacing={2}>
                            <TextField label="Author" sx={{ flex: 2 }} variant="filled" value={author} error={!!errors.author} helperText={errors.author} onChange={(e) => setAuthor(e.target.value)} InputProps={{ sx: { borderRadius: '12px' } }} />
                            <TextField label="Category" sx={{ flex: 1 }} variant="filled" value={category} error={!!errors.category} helperText={errors.category} onChange={(e) => setCategory(e.target.value)} InputProps={{ sx: { borderRadius: '12px' } }} />
                        </Stack>
                        <TextField fullWidth multiline rows={3} label="Brief Description" variant="filled" value={description} onChange={(e) => setDescription(e.target.value)} InputProps={{ sx: { borderRadius: '12px' } }} />
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 4, bgcolor: 'action.hover' }}>
                <Button onClick={onClose} variant="text" color="inherit" sx={{ fontWeight: 700 }} disabled={isUploading}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disableElevation disabled={isUploading} sx={{ borderRadius: '12px', px: 6, py: 1.5, fontWeight: 900, fontSize: '1rem' }}>
                    {isUploading ? 'PLEASE WAIT...' : initialData ? 'UPDATE RESOURCE' : 'SAVE RESOURCE'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EBookFormDialog;