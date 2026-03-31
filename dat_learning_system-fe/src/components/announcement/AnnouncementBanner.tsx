import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade, IconButton, Stack, Chip } from '@mui/material';
import { Campaign, Close, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { keyframes, styled } from '@mui/system';
import { useNotifications } from '../../context/NotificationContext';

const pulse = keyframes`
  0% { transform: scale(1); filter: drop-shadow(0 0 2px #00e5ff); }
  50% { transform: scale(1.05); filter: drop-shadow(0 0 8px #00e5ff); }
  100% { transform: scale(1); filter: drop-shadow(0 0 2px #00e5ff); }
`;

const GlassBanner = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isTargeted',
})(({ isTargeted }: { isTargeted: boolean; theme?: any }) => ({
    background: isTargeted
        ? 'linear-gradient(90deg, rgba(255, 145, 0, 0.12) 0%, rgba(15, 15, 15, 0.9) 100%)'
        : 'linear-gradient(90deg, rgba(0, 229, 255, 0.12) 0%, rgba(15, 15, 15, 0.9) 100%)',
    backdropFilter: 'blur(12px)',
    borderLeft: `4px solid ${isTargeted ? '#ff9100' : '#00e5ff'}`,
    borderRadius: '12px',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    minHeight: '70px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'relative',
    overflow: 'hidden'
}));

const AnnouncementBanner = () => {
    const { announcements } = useNotifications();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const [fade, setFade] = useState(true);

    // Auto-slide every 8 seconds
    useEffect(() => {
        if (announcements.length <= 1) return;

        const timer = setInterval(() => {
            handleNext();
        }, 8000);

        return () => clearInterval(timer);
    }, [announcements.length, currentIndex]);

    if (announcements.length === 0 || !visible) return null;

    const current = announcements[currentIndex];
    const isTargeted = !!current.targetPosition;

    const handleNext = () => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
            setFade(true);
        }, 300);
    };

    const handlePrev = () => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
            setFade(true);
        }, 300);
    };

    return (
        <Box sx={{ mb: 3, width: '100%', px: 1 }}>
            <GlassBanner isTargeted={isTargeted}>
                {/* Status Icon */}
                <Box sx={{ mr: 2, color: isTargeted ? '#ff9100' : '#00e5ff', animation: `${pulse} 2s infinite` }}>
                    <Campaign fontSize="large" />
                </Box>

                {/* Content with Fade Transition */}
                <Fade in={fade} timeout={300}>
                    <Stack spacing={0} sx={{ flexGrow: 1 }}>
                        <Typography variant="caption" sx={{ color: isTargeted ? '#ff9100' : '#00e5ff', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: 1 }}>
                            {isTargeted ? `Priority: ${current.targetPosition}` : "Broadcast Message"}
                            {announcements.length > 1 && ` (${currentIndex + 1} of ${announcements.length})`}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fff' }}>
                            {current.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: -0.5 }}>
                            {current.content}
                        </Typography>
                    </Stack>
                </Fade>

                {/* Navigation Controls (Only show if > 1) */}
                <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                    {announcements.length > 1 && (
                        <>
                            <IconButton size="small" onClick={handlePrev} sx={{ color: 'rgba(255,255,255,0.3)' }}><ChevronLeft /></IconButton>
                            <IconButton size="small" onClick={handleNext} sx={{ color: 'rgba(255,255,255,0.3)' }}><ChevronRight /></IconButton>
                        </>
                    )}
                    <IconButton
                        size="small"
                        onClick={() => setVisible(false)}
                        sx={{ color: 'rgba(255,255,255,0.5)', zIndex: 20, position: 'relative' }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </Stack>
            </GlassBanner>

            {/* Pagination Dots */}
            {announcements.length > 1 && (
                <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 1 }}>
                    {announcements.map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: i === currentIndex ? 12 : 6,
                                height: 6,
                                borderRadius: 3,
                                bgcolor: i === currentIndex ? (isTargeted ? '#ff9100' : '#00e5ff') : 'rgba(255,255,255,0.2)',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default AnnouncementBanner;