import { useState, useEffect } from 'react';
import { Box, Typography, Fade, IconButton, Stack } from '@mui/material';
import { Campaign, Close, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { keyframes, styled, useTheme } from '@mui/material/styles';
import { useNotifications } from '../../context/NotificationContext';

// 1. Keyframes moved outside and parameterized
const pulse = (color: string) => keyframes`
  0% { transform: scale(1); filter: drop-shadow(0 0 2px ${color}); }
  50% { transform: scale(1.05); filter: drop-shadow(0 0 8px ${color}); }
  100% { transform: scale(1); filter: drop-shadow(0 0 2px ${color}); }
`;

// 2. Styled component handles its own theme injection
const GlassBanner = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isTargeted',
})(({ isTargeted, theme }: { isTargeted: boolean; theme?: any }) => {
    const isDark = theme.palette.mode === 'dark';
    const mainColor = isTargeted ? '#ff9100' : (isDark ? '#00e5ff' : '#1976d2');

    return {
        background: isDark
            ? `linear-gradient(90deg, rgba(61, 167, 253, 0.1) 0%, ${theme.palette.background.paper}e6 100%)`
            : `linear-gradient(90deg, rgba(25, 118, 210, 0.05) 0%, ${theme.palette.background.paper}f2 100%)`,
        backdropFilter: 'blur(12px)',
        borderLeft: `4px solid ${mainColor}`,
        borderRadius: '12px',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        minHeight: '70px',
        boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.4)'
            : '0 4px 20px rgba(0,0,0,0.08)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
        position: 'relative',
        overflow: 'hidden'
    };
});

const AnnouncementBanner = () => {
    const { announcements } = useNotifications();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const [fade, setFade] = useState(true);
    
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Auto-slide every 8 seconds
    useEffect(() => {
        if (announcements.length <= 1) return;
        const timer = setInterval(() => handleNext(), 8000);
        return () => clearInterval(timer);
    }, [announcements.length, currentIndex]);

    if (announcements.length === 0 || !visible) return null;

    const current = announcements[currentIndex];
    const isTargeted = !!current.targetPosition;
    const accentColor = isTargeted ? '#ff9100' : (isDark ? '#00e5ff' : '#1976d2');

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
            {/* Note: theme prop is NOT passed here manually anymore */}
            <GlassBanner isTargeted={isTargeted}>
                <Box sx={{
                    mr: 2,
                    color: accentColor,
                    animation: `${pulse(accentColor)} 2s infinite`
                }}>
                    <Campaign fontSize="large" />
                </Box>

                <Fade in={fade} timeout={300}>
                    <Stack spacing={0} sx={{ flexGrow: 1 }}>
                        <Typography variant="caption" sx={{
                            color: accentColor,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            fontSize: '0.6rem',
                            letterSpacing: 1
                        }}>
                            {isTargeted ? `Priority: ${current.targetPosition}` : "Broadcast Message"}
                            {announcements.length > 1 && ` (${currentIndex + 1} of ${announcements.length})`}
                        </Typography>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {current.title}
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: -0.5 }}>
                            {current.content}
                        </Typography>
                    </Stack>
                </Fade>

                <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                    {announcements.length > 1 && (
                        <>
                            <IconButton size="small" onClick={handlePrev} sx={{ color: 'text.disabled' }}>
                                <ChevronLeft />
                            </IconButton>
                            <IconButton size="small" onClick={handleNext} sx={{ color: 'text.disabled' }}>
                                <ChevronRight />
                            </IconButton>
                        </>
                    )}
                    <IconButton
                        size="small"
                        onClick={() => setVisible(false)}
                        sx={{ color: 'text.disabled' }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </Stack>
            </GlassBanner>

            {announcements.length > 1 && (
                <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 1 }}>
                    {announcements.map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: i === currentIndex ? 12 : 6,
                                height: 6,
                                borderRadius: 3,
                                bgcolor: i === currentIndex ? accentColor : 'text.disabled',
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