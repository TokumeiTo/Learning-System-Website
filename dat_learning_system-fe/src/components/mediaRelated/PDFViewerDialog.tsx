import React, { useMemo } from 'react';
import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Box, CircularProgress } from '@mui/material';
import { Close } from '@mui/icons-material';
import type { TransitionProps } from '@mui/material/transitions';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
    open: boolean;
    onClose: () => void;
    fileUrl: string;
    title: string;
}

const PDFViewerDialog: React.FC<Props> = ({ open, onClose, fileUrl, title }) => {
    // 1. Initialize the plugin at the TOP LEVEL. 
    // Do NOT wrap this in useMemo, because the plugin itself creates internal hooks.
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) => [defaultTabs[0]]
    });

    // 2. All other logic must stay below the plugin initialization.
    // We use 'open' to hide the content, but we don't return early to keep hook counts stable.
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            PaperProps={{ sx: { bgcolor: '#1a1a1a' } }}
        >
            {open && (
                <>
                    <AppBar sx={{ position: 'relative', bgcolor: '#2d2d2d' }}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={onClose}>
                                <Close />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
                                {title}
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'hidden', bgcolor: '#1a1a1a' }}>
                        {fileUrl ? (
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                <Viewer
                                    fileUrl={fileUrl}
                                    plugins={[defaultLayoutPluginInstance]}
                                    theme="dark"
                                    defaultScale={0.9}
                                    renderLoader={(percentages: number) => (
                                        <Box sx={{
                                            color: 'white',
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%'
                                        }}>
                                            <CircularProgress color="inherit" />
                                            <Typography sx={{ mt: 2 }}>
                                                Loading PDF... {Math.round(percentages)}%
                                            </Typography>
                                        </Box>
                                    )}
                                />
                            </Worker>
                        ) : (
                            <Box sx={{ color: 'white', p: 5, textAlign: 'center' }}>
                                <Typography>Validating file path...</Typography>
                            </Box>
                        )}
                    </Box>
                </>
            )}
        </Dialog>
    );
};

export default PDFViewerDialog;