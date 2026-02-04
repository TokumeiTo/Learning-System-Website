import React from 'react';
import { Box, Typography, Stack, CircularProgress, Tooltip, IconButton } from '@mui/material';
import { ContentCopy, VolumeUp } from '@mui/icons-material';

interface ResultProps {
    loading: boolean;
    translatedText: string;
    romajiText: string;
    sourceText: string;
    targetLang: string;
    onCopy: () => void;
    onSpeak: (text: string, lang: string) => void;
}

const TranslationResult: React.FC<ResultProps> = ({ 
    loading, translatedText, romajiText, sourceText, targetLang, onCopy, onSpeak 
}) => {
    return (
        <Box sx={{ flex: 1, p: 3, bgcolor: 'action.hover', position: 'relative' }}>
            {translatedText && !loading && (sourceText.includes("[Technical IT Context]") || translatedText.length > 0) && (
                <Typography variant="caption" sx={{ 
                    position: 'absolute', top: 12, right: 16, color: 'primary.main', 
                    fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem',
                    bgcolor: 'rgba(25, 118, 210, 0.08)', px: 1, py: 0.5, borderRadius: 1 
                }}>
                    IT Optimized
                </Typography>
            )}

            {loading ? (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%', minHeight: 250 }}>
                    <CircularProgress size={32} thickness={5} />
                    <Typography variant="body2" sx={{ mt: 2, fontWeight: 600, color: 'text.secondary' }}>
                        Processing via API...
                    </Typography>
                </Stack>
            ) : (
                <>
                    <Typography variant="body1" sx={{ 
                        fontSize: '1.15rem', lineHeight: 1.6, minHeight: romajiText ? 10 : 250,
                        color: translatedText ? 'text.primary' : 'text.disabled',
                        whiteSpace: 'pre-wrap', fontWeight: 500, pt: 1 
                    }}>
                        {translatedText || "Translation output will appear here automatically..."}
                    </Typography>

                    {romajiText && (
                        <Typography variant="body2" sx={{ 
                            mt: 1, pb: 2, fontStyle: 'italic', color: 'text.secondary',
                            fontSize: '0.9rem', borderLeft: '2px solid', borderColor: 'primary.light', pl: 1.5 
                        }}>
                            {romajiText}
                        </Typography>
                    )}

                    <Stack direction="row" spacing={1} sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Tooltip title="Copy">
                            <IconButton onClick={onCopy} size="small" disabled={!translatedText}><ContentCopy fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Listen">
                            <IconButton onClick={() => onSpeak(translatedText, targetLang)} size="small" disabled={!translatedText}><VolumeUp fontSize="small" /></IconButton>
                        </Tooltip>
                    </Stack>
                </>
            )}
        </Box>
    );
};

export default TranslationResult;