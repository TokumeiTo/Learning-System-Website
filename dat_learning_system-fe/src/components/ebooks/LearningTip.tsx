import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material'; // More "insightful" icon
import { motion } from 'framer-motion';

interface LearningTipProps {
    tip?: string;
}

const LearningTip: React.FC<LearningTipProps> = ({ 
    tip = "Consistency beats intensity! Even 5 minutes of Kanji practice a day builds long-term memory." 
}) => {

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }} // Subtle lift on hover
            sx={{ mb: 6 }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 6,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    border: '1px solid',
                    borderColor: '#e2e8f0',
                    // Soft gradient background for a "mentor" feel
                    background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
                }}
            >
                {/* Decorative background element */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        bgcolor: 'primary.main',
                        opacity: 0.04,
                        borderRadius: '50%',
                    }}
                />

                {/* Icon with an "Outer Glow" effect */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        borderRadius: 4,
                        bgcolor: 'white',
                        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.15)',
                        flexShrink: 0
                    }}
                >
                    <AutoAwesome sx={{ color: '#3b82f6', fontSize: 28 }} />
                </Box>

                <Box>
                    <Typography 
                        variant="overline" 
                        fontWeight={900} 
                        sx={{ 
                            color: '#3b82f6', 
                            letterSpacing: 1.5,
                            display: 'block',
                            mb: 0.5
                        }}
                    >
                        Pro Tip
                    </Typography>
                    <Typography 
                        variant="body1" 
                        fontWeight={600}
                        sx={{ 
                            color: '#1e3a8a', 
                            lineHeight: 1.6,
                            fontSize: '0.95rem'
                        }}
                    >
                        "{tip}"
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default LearningTip;