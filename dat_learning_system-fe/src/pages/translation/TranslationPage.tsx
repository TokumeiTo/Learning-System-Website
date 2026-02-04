import React, { useState } from 'react';
import {
    Box, Typography, Stack, Paper, TextField, IconButton,
    Button, MenuItem, Select, Divider, Alert, Snackbar,
    CircularProgress
} from '@mui/material';
import {
    CompareArrows, Translate, History, AutoFixHigh, Gavel
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Layout & API
import PageLayout from '../../components/layout/PageLayout';
import { translateText } from '../../api/translation.api';
import type { TranslationHistoryItem, TranslationRequest } from '../../types/translation';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Your New Separated Components
import TranslationResult from '../../components/translation/TranslationResult';
import HistoryDrawer from '../../components/translation/HistoryDrawer';

const TranslationPage: React.FC = () => {
    // State
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [romajiText, setRomajiText] = useState('');
    const [loading, setLoading] = useState(false);
    const [sourceLang, setSourceLang] = useState('auto');
    const [targetLang, setTargetLang] = useState('en');
    const [error, setError] = useState<string | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [history, setHistory] = useState<TranslationHistoryItem[]>(
        JSON.parse(localStorage.getItem('trans_history') || '[]')
    );

    const handleTranslate = async (isItContext: boolean = false) => {
        if (!sourceText.trim()) return;

        setLoading(true);
        setError(null);

        const request: TranslationRequest = {
            text: sourceText,
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
            isItContext: isItContext
        };

        try {
            const data = await translateText(request);
            
            // 1. Clean the IT tag from the display result
            const finalResult = data.translatedText.replace(/\[Technical IT Context\]:\s*/gi, "");
            
            setTranslatedText(finalResult);
            setRomajiText(data.romaji || ''); 

            // 2. Save to History (Using cleaned text)
            const newEntry: TranslationHistoryItem = {
                id: Date.now(),
                source: sourceText,
                translated: finalResult,
                romaji: data.romaji,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            const updatedHistory = [newEntry, ...history].slice(0, 10);
            setHistory(updatedHistory);
            localStorage.setItem('trans_history', JSON.stringify(updatedHistory));
        } catch (err: any) {
            const msg = err.response?.data?.message || "Translation service is currently unavailable.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const loadFromHistory = (item: TranslationHistoryItem) => {
        setSourceText(item.source);
        setTranslatedText(item.translated);
        setRomajiText(item.romaji || '');
    };

    const swapLanguages = () => {
        if (sourceLang === 'auto') return;
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setSourceText(translatedText);
        setTranslatedText(sourceText);
    };

    const speakText = (text: string, lang: string) => {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'ja' ? 'ja-JP' : 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <PageLayout>
            <Box sx={{ minHeight: 'calc(100vh - 65px)', bgcolor: 'background.default', p: { xs: 2, md: 6 } }}>

                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={900} color="text.primary">
                            Corporate Translator
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Gavel sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                Secure Internal Gateway • Audit Log Enabled
                            </Typography>
                        </Stack>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button 
                            startIcon={<History />} 
                            onClick={() => setIsHistoryOpen(true)}
                            color="inherit" 
                            sx={{ fontWeight: 600, textTransform: 'none' }}
                        >
                            History
                        </Button>
                    </Stack>
                </Stack>

                {/* Main Workspace */}
                <Box component={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        
                        {/* Toolbar */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} size="small" sx={{ minWidth: 160, borderRadius: 2 }}>
                                <MenuItem value="auto"><AutoAwesomeIcon fontSize='small' sx={{color:'orange'}}/> Detect Language</MenuItem>
                                <MenuItem value="ja">Japanese</MenuItem>
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="my">Myanmar</MenuItem>
                            </Select>

                            <IconButton onClick={swapLanguages} disabled={sourceLang === 'auto'} sx={{ border: '1px solid', borderColor: 'divider' }}>
                                <CompareArrows color={sourceLang === 'auto' ? "disabled" : "primary"} />
                            </IconButton>

                            <Select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} size="small" sx={{ minWidth: 140, borderRadius: 2 }}>
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="ja">Japanese</MenuItem>
                                <MenuItem value="my">Myanmar</MenuItem>
                            </Select>
                        </Stack>

                        {/* Input/Output Area */}
                        <Stack direction={{ xs: 'column', md: 'row' }} divider={<Divider orientation="vertical" flexItem />}>
                            {/* Source Side */}
                            <Box sx={{ flex: 1, p: 3 }}>
                                <TextField
                                    fullWidth multiline rows={10} variant="standard"
                                    placeholder="Paste technical logs or emails..."
                                    value={sourceText}
                                    onChange={(e) => setSourceText(e.target.value)}
                                    InputProps={{ disableUnderline: true, style: { fontSize: '1.15rem' }}}
                                />
                                <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                                    <Typography variant="caption" color="text.disabled">
                                        {sourceText.length.toLocaleString()} characters
                                    </Typography>
                                    <Button 
                                        startIcon={<AutoFixHigh />} variant="outlined" size="small"
                                        onClick={() => handleTranslate(true)} disabled={loading || !sourceText}
                                    >
                                        Improve for IT Context
                                    </Button>
                                </Stack>
                            </Box>

                            {/* Result Side Component */}
                            <TranslationResult 
                                loading={loading}
                                translatedText={translatedText}
                                romajiText={romajiText}
                                sourceText={sourceText}
                                targetLang={targetLang}
                                onCopy={() => navigator.clipboard.writeText(translatedText)}
                                onSpeak={speakText}
                            />
                        </Stack>
                    </Paper>

                    {/* Submit */}
                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Button
                            variant="contained" size="large" onClick={() => handleTranslate(false)}
                            disabled={loading || !sourceText}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Translate />}
                            sx={{ borderRadius: 3, px: 5, fontWeight: 800 }}
                        >
                            {loading ? "Translating..." : "Translate"}
                        </Button>
                    </Stack>
                </Box>

                {/* History Drawer Component */}
                <HistoryDrawer 
                    open={isHistoryOpen} 
                    onClose={() => setIsHistoryOpen(false)} 
                    history={history}
                    onSelect={loadFromHistory}
                    onClear={() => { setHistory([]); localStorage.removeItem('trans_history'); }}
                />

                {/* Alerts/Snackbars */}
                <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
                    <Alert severity="error" variant="filled">{error}</Alert>
                </Snackbar>

            </Box>
        </PageLayout>
    );
};

export default TranslationPage;