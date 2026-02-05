import React from 'react';
import {
    Box, Typography, Stack, Paper, TextField, Button,
    MenuItem, Select, FormControl, FormHelperText,
    Alert, AlertTitle, Divider, CircularProgress
} from '@mui/material';
import { Send, AttachFile, BugReport, Psychology } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';

/**
 * 1. THE SCHEMA & TYPE INFERENCE
 * This solves the TS error by ensuring the schema and the 
 * type definition are perfectly synced.
 */
const bugSchema = yup.object({
    type: yup.string().required('Please select the issue type'),
    subject: yup.string().required('Subject is required').min(5, 'Too short'),
    description: yup.string().required('Description must be at least 20 characters').min(20),
    pageUrl: yup
        .string()
        .url('Please enter a valid URL (e.g., https://...)')
        .transform((value) => (value === "" ? undefined : value))
        .optional(), // Tells TS and Yup this key can be missing or undefined
});

// Automatically extract the TypeScript type from the schema
type BugFormInputs = yup.InferType<typeof bugSchema>;

const BugReportForm: React.FC = () => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isSubmitSuccessful }
    } = useForm<BugFormInputs>({
        resolver: yupResolver(bugSchema) as any,
        defaultValues: {
            type: '',
            subject: '',
            description: '',
            pageUrl: undefined // Matches the .optional() in schema
        }
    });

    const onSubmit = async (data: BugFormInputs) => {
        // Replace with your real API call (e.g., axios.post('/api/bugs', data))
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Bug Report Data:", data);
    };

    return (
        <Box sx={{ minHeight: 'calc(100vh - 65px)', p: { xs: 2, md: 3 } }}>
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>

                {/* Header */}
                <Stack spacing={1} sx={{ mb: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <BugReport color="primary" sx={{ fontSize: 32 }} />
                        <Typography variant="h4" fontWeight={900} color="text.default">
                            Bug Report & Feedback
                        </Typography>
                    </Stack>
                    <Typography color="text.secondary">
                        Encountered an issue with your Japanese, IT, or English courses? Let us know.
                    </Typography>
                </Stack>

                {isSubmitSuccessful ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Alert severity="success" sx={{ borderRadius: 4, py: 3, border: '1px solid #bbf7d0' }}>
                            <AlertTitle sx={{ fontWeight: 800 }}>Report Submitted!</AlertTitle>
                            Our technical team has received your feedback. You can track the status in your notifications.
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    onClick={() => reset()}
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    sx={{ borderRadius: 2, fontWeight: 700 }}
                                >
                                    Submit Another Report
                                </Button>
                            </Box>
                        </Alert>
                    </motion.div>
                ) : (
                    <Paper
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        sx={{ p: { xs: 2, md: 3 }, borderRadius: 6, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
                    >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={4}>

                                {/* 1. Category Selection */}
                                <FormControl fullWidth error={!!errors.type}>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Issue Category</Typography>
                                    <Controller
                                        name="type"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} sx={{ borderRadius: 3, bgcolor: 'background.paper' }}>
                                                <MenuItem value="Technical Bug">Technical Bug (Website Issue)</MenuItem>
                                                <MenuItem value="Content Error">Course Content Error (Japanese/English typo)</MenuItem>
                                                <MenuItem value="Feature Request">Feature Request</MenuItem>
                                                <MenuItem value="Account Issue">Account / Login Issue</MenuItem>
                                            </Select>
                                        )}
                                    />
                                    <FormHelperText>{errors.type?.message}</FormHelperText>
                                </FormControl>

                                {/* 2. Subject */}
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Short Summary</Typography>
                                    <Controller
                                        name="subject"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                placeholder="e.g., Jisho Dictionary not loading"
                                                error={!!errors.subject}
                                                helperText={errors.subject?.message}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'background.paper' } }}
                                            />
                                        )}
                                    />
                                </Box>

                                {/* 3. Page URL (Optional) */}
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Page URL (Optional)</Typography>
                                    <Controller
                                        name="pageUrl"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                value={field.value ?? ''} // MUI requires '' instead of undefined
                                                fullWidth
                                                placeholder="Paste the link where the error happened"
                                                error={!!errors.pageUrl}
                                                helperText={errors.pageUrl?.message}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'background.paper' } }}
                                            />
                                        )}
                                    />
                                </Box>

                                {/* 4. Description */}
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Detailed Explanation</Typography>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={5}
                                                placeholder="Steps to reproduce the bug or details of the typo..."
                                                error={!!errors.description}
                                                helperText={errors.description?.message}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'background.paper' } }}
                                            />
                                        )}
                                    />
                                </Box>

                                {/* File Upload Simulation */}
                                <Box>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<AttachFile />}
                                        sx={{ borderRadius: 2, textTransform: 'none', borderStyle: 'dashed' }}
                                    >
                                        Attach Screenshot
                                        <input type="file" hidden />
                                    </Button>
                                </Box>

                                <Divider />

                                {/* Action Buttons */}
                                <Stack direction="row" spacing={2} justifyContent="flex-end">
                                    <Button sx={{ borderRadius: 3, fontWeight: 700 }} onClick={() => reset()}>Clear</Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                                        sx={{
                                            borderRadius: 3,
                                            px: 6,
                                            fontWeight: 800,
                                            py: 1.2,
                                            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
                                        }}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Send Report'}
                                    </Button>
                                </Stack>
                            </Stack>
                        </form>
                    </Paper>
                )}

                {/* Knowledge Base Tip */}
                <Paper sx={{ mt: 4, p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.tertiary', border: 'none' }}>
                    <Psychology color="primary" />
                    <Typography variant="body2" fontWeight={600} color="text.tertiary">
                        Wait! Have you checked the <b>FAQ section</b>? Most common IT and course access issues are resolved there.
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default BugReportForm;