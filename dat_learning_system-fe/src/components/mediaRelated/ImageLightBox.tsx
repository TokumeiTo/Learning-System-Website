import { downloadFile } from '../../api/filemanager.api';
import { Dialog, Box, IconButton, Button, Stack, Typography, Tooltip } from '@mui/material';
import { Close, Download, Link as LinkIcon, Check } from '@mui/icons-material';
import { useState } from 'react';

interface ImageLightboxProps {
    imageUrl: string | null;
    onClose: () => void;
}

const ImageLightbox = ({ imageUrl, onClose }: ImageLightboxProps) => {
    const [copied, setCopied] = useState(false);

    if (!imageUrl) return null;

    const fullUrl = imageUrl.startsWith('http') 
        ? imageUrl 
        : `${import.meta.env.VITE_API_URL}${imageUrl}`;

    const handleDownload = async () => {
        try {
            const blob = await downloadFile(imageUrl);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            const fileName = imageUrl.split('/').pop() || 'download';
            link.setAttribute('download', fileName);
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Manual download failed", e);
            const fullUrl = imageUrl.startsWith('http') ? imageUrl: `${import.meta.env.VITE_API_URL}${imageUrl}`;
            window.open(fullUrl, '_blank');
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog
            fullScreen // Uses more space on mobile, still behaves like a modal on desktop
            open={Boolean(imageUrl)}
            onClose={onClose}
            PaperProps={{
                sx: { bgcolor: 'rgba(15, 23, 42, 0.95)', backgroundImage: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }
            }}
        >
            {/* Top Toolbar */}
            <Stack 
                direction="row" 
                spacing={1} 
                sx={{ position: 'fixed', top: 20, right: 20, zIndex: 10 }}
            >
                <Tooltip title={copied ? "Copied!" : "Copy Link"}>
                    <IconButton onClick={handleCopyLink} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                        {copied ? <Check color="success" /> : <LinkIcon />}
                    </IconButton>
                </Tooltip>

                <Tooltip title="Download">
                    <IconButton onClick={handleDownload} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                        <Download />
                    </IconButton>
                </Tooltip>

                <IconButton onClick={onClose} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                    <Close />
                </IconButton>
            </Stack>

            <Box
                component="img"
                src={fullUrl}
                sx={{
                    maxWidth: '95vw',
                    maxHeight: '85vh',
                    objectFit: 'contain',
                    borderRadius: 1,
                    boxShadow: '0 0 40px rgba(0,0,0,0.5)'
                }}
            />
            
            <Typography variant="caption" sx={{ position: 'fixed', bottom: 20, color: 'rgba(255,255,255,0.5)' }}>
                {imageUrl.split('/').pop()}
            </Typography>
        </Dialog>
    );
};

export default ImageLightbox;