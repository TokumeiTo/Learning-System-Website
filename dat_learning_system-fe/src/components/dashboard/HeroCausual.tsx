import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Button, Chip, IconButton } from '@mui/material';
import {  
  ChevronLeft, 
  ChevronRight, 
  Terminal, 
  Translate, 
  RecordVoiceOver 
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// --- Data for the 3 Banners ---
const BANNERS = [
  {
    id: 1,
    tag: "MANDATORY FOR Q1",
    title: "Internal Japanese Communication",
    description: 'All employees must complete the "Keigo in Emails" certification by March 15th.',
    btnText: "Start Learning",
    bg: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
    sideText: "日本語",
    icon: <Translate />,
    color: "error" as const
  },
  {
    id: 2,
    tag: "IT & SECURITY",
    title: "Cloud Architecture & Security",
    description: "Upgrade our infrastructure. Complete the AWS Essentials module to access project repos.",
    btnText: "Open Sandbox",
    bg: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)",
    sideText: "CODE",
    icon: <Terminal />,
    color: "primary" as const
  },
  {
    id: 3,
    tag: "GLOBAL SKILLS",
    title: "Business English Fluency",
    description: "Improving client relations through better articulation. Join the weekly speaking workshop.",
    btnText: "Join Session",
    bg: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
    sideText: "EN",
    icon: <RecordVoiceOver />,
    color: "success" as const
  }
];

const HeroCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-play every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [index]);

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1 === BANNERS.length ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', mb: 5, minHeight: 350, overflow: 'hidden', borderRadius: 5 }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            height: '100%',
            background: BANNERS[index].bg,
            color: 'white',
          }}>
            {/* Text Content */}
            <Box sx={{ flex: 1.5, p: 5 }}>
              <Stack spacing={2}>
                <Chip 
                  icon={BANNERS[index].icon} 
                  label={BANNERS[index].tag} 
                  color={BANNERS[index].color} 
                  variant="filled" 
                  sx={{ width: 'fit-content', p:'10px', fontWeight: 700, bgcolor: 'black', backdropFilter: 'blur(4px)', color: 'white' }} 
                />
                <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: -1 }}>
                  {BANNERS[index].title}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  {BANNERS[index].description}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button variant="contained" size="large" sx={{ borderRadius: 3, px: 4, bgcolor: 'white', color: '#0f172a', '&:hover': { bgcolor: '#f1f5f9' } }}>
                    {BANNERS[index].btnText}
                  </Button>
                  <Button variant="outlined" size="large" sx={{ borderRadius: 3, px: 4, color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                    View Syllabus
                  </Button>
                </Stack>
              </Stack>
            </Box>

            {/* Visual Side */}
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
               <Typography variant="h1" sx={{ opacity: 0.1, fontWeight: 900, transform: 'rotate(-10deg)' }}>
                 {BANNERS[index].sideText}
               </Typography>
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 20, right: 30, zIndex: 10 }}>
        <IconButton 
          onClick={handlePrev} 
          sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton 
          onClick={handleNext} 
          sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
        >
          <ChevronRight />
        </IconButton>
      </Stack>

      {/* Progress Indicators */}
      <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 30, right: 40, zIndex: 10 }}>
        {BANNERS.map((_, i) => (
          <Box 
            key={i}
            sx={{ 
              width: i === index ? 30 : 8, 
              height: 8, 
              borderRadius: 4, 
              bgcolor: i === index ? 'white' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease'
            }} 
          />
        ))}
      </Stack>
    </Box>
  );
};

export default HeroCarousel;