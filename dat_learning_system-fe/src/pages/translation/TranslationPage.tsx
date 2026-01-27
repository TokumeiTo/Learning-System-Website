import React, { useState } from 'react';
import {
    Box, Typography, Stack, Paper, TextField, IconButton,
    Button, MenuItem, Select, CircularProgress, Divider,
    Tooltip, Alert, Snackbar
} from '@mui/material';
import {
    CompareArrows, ContentCopy, VolumeUp, Translate,
    History, Settings, AutoFixHigh, Gavel
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import PageLayout from '../../components/layout/PageLayout';

// --- Note ---
// If you are self-hosting, replace this URL with your local instance
// Default local address is usually http://localhost:5000/translate
const LIBRE_API_URL = "https://libretranslate.de/translate";

const TranslationPage: React.FC = () => {
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [sourceLang, setSourceLang] = useState('ja');
    const [targetLang, setTargetLang] = useState('en');
    const [error, setError] = useState<string | null>(null);

    const handleTranslate = async () => {
        if (!sourceText.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await axios.post(LIBRE_API_URL, {
                q: sourceText,
                source: sourceLang,
                target: targetLang,
                format: "text",
                api_key: "" // Leave empty if your local instance doesn't require one
            });

            setTranslatedText(res.data.translatedText);
        } catch (err) {
            setError("Unable to connect to LibreTranslate. Ensure your server is running.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const swapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setSourceText(translatedText);
        setTranslatedText(sourceText);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(translatedText);
    };

    return (
        <PageLayout>
            <Box sx={{ minHeight: 'calc(100vh - 65px)', bgcolor: '#background.default', p: { xs: 2, md: 6 } }}>

                {/* 1. Header Area */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={900} color="text.primary">
                            Corporate Translator
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Gavel sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                Powered by LibreTranslate • Private & Secure Internal Instance
                            </Typography>
                        </Stack>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button startIcon={<History />} color="inherit" sx={{ fontWeight: 600 }}>History</Button>
                        <IconButton><Settings /></IconButton>
                    </Stack>
                </Stack>

                {/* 2. Translation Workspace */}
                <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 6,
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.04)'
                        }}
                    >
                        {/* Language Selector Bar */}
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ px: 3, py: 2, bgcolor: '#background.paper', borderBottom: '1px solid #e2e8f0' }}
                        >
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                                <Select
                                    value={sourceLang}
                                    onChange={(e) => setSourceLang(e.target.value)}
                                    size="small"
                                    sx={{ minWidth: 150, borderRadius: 3, bgcolor: 'background.paper', fontWeight: 600 }}
                                >
                                    <MenuItem value="ja">Japanese</MenuItem>
                                    <MenuItem value="en">English</MenuItem>
                                    <MenuItem value="auto">Detect Language</MenuItem>
                                </Select>
                            </Stack>

                            <IconButton onClick={swapLanguages} sx={{ mx: 3, bgcolor: 'background.paper', border: '1px solid #e2e8f0' }}>
                                <CompareArrows color="primary" />
                            </IconButton>

                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ flex: 1 }}>
                                <Select
                                    value={targetLang}
                                    onChange={(e) => setTargetLang(e.target.value)}
                                    size="small"
                                    sx={{ minWidth: 150, borderRadius: 3, bgcolor: 'background.paper', fontWeight: 600 }}
                                >
                                    <MenuItem value="en">English</MenuItem>
                                    <MenuItem value="ja">Japanese</MenuItem>
                                </Select>
                            </Stack>
                        </Stack>

                        {/* Text Input/Output Area (Flex Container) */}
                        <Stack direction={{ xs: 'column', md: 'row' }} divider={<Divider orientation="vertical" flexItem />}>

                            {/* Input Box */}
                            <Box sx={{ flex: 1, p: 4 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={10}
                                    placeholder="Type or paste text here (IT reports, emails, etc.)..."
                                    variant="standard"
                                    InputProps={{
                                        disableUnderline: true,
                                        style: { fontSize: '1.25rem', lineHeight: 1.6, fontWeight: 400 }
                                    }}
                                    value={sourceText}
                                    onChange={(e) => setSourceText(e.target.value)}
                                />
                                <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {sourceText.length} / 5000 characters
                                    </Typography>
                                    <Button
                                        startIcon={<AutoFixHigh />}
                                        size="small"
                                        sx={{ color: 'text.secondary', textTransform: 'none' }}
                                    >
                                        Improve for IT Context
                                    </Button>
                                </Stack>
                            </Box>

                            {/* Output Box */}
                            <Box sx={{ flex: 1, p: 4, bgcolor: '#background.paper' }}>
                                {loading ? (
                                    <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                                        <CircularProgress size={30} thickness={5} />
                                        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>Translating...</Typography>
                                    </Stack>
                                ) : (
                                    <>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: '1.25rem',
                                                lineHeight: 1.6,
                                                minHeight: 250,
                                                color: translatedText ? 'inherit' : '#94a3b8'
                                            }}
                                        >
                                            {translatedText || "The translation will appear here automatically..."}
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ mt: 2, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                                            <Tooltip title="Copy to Clipboard">
                                                <IconButton onClick={copyToClipboard} size="small"><ContentCopy fontSize="small" /></IconButton>
                                            </Tooltip>
                                            <IconButton size="small"><VolumeUp fontSize="small" /></IconButton>
                                        </Stack>
                                    </>
                                )}
                            </Box>
                        </Stack>
                    </Paper>

                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleTranslate}
                            disabled={loading}
                            size="large"
                            startIcon={<Translate />}
                            sx={{
                                borderRadius: 4,
                                px: 6,
                                py: 1.8,
                                fontWeight: 800,
                                fontSize: '1rem',
                                boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
                            }}
                        >
                            Translate
                        </Button>
                    </Stack>
                </Box>

                {/* 3. Footer Context Tip */}
                <Alert
                    severity="info"
                    icon={<Translate fontSize="inherit" />}
                    sx={{ mt: 6, borderRadius: 4, bgcolor: '#e0e7ff', color: '#3730a3', border: 'none' }}
                >
                    <b>Corporate Guideline:</b> Use this tool for internal documentation only. For official customer-facing contracts, please refer to the <b>Official Glossary</b> in the Dictionary page.
                </Alert>

                {error && (
                    <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                        <Alert severity="error" variant="filled">{error}</Alert>
                    </Snackbar>
                )}
            </Box>
        </PageLayout>
    );
};

export default TranslationPage;