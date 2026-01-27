import React, { useState } from 'react';
import { 
  Box, Typography, Stack, Paper, Radio, RadioGroup, 
  FormControlLabel, Button, Chip, LinearProgress, Divider, List, ListItem, ListItemIcon, ListItemText 
} from '@mui/material';
import { Timer, Send, Info, CheckCircle, PlayLesson, MenuBook, Headphones } from '@mui/icons-material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const MockTestPage = () => {
  const [step, setStep] = useState(0); // 0: Rules, 1: Sections, 2: Exam
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');

  // 1. RULES VIEW
  if (step === 0) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Paper sx={{ maxWidth: 600, p: 5, borderRadius: 6, bgcolor: '#1e293b', color: 'white' }}>
          <Stack spacing={3}>
            <Typography variant="h4" fontWeight={900} textAlign="center">JLPT Exam Rules</Typography>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <List>
              {[
                "You cannot pause the timer once the section begins.",
                "Each section has a strict time limit (just like the real JLPT).",
                "Listening sections can only be played once.",
                "Ensure your internet connection is stable before starting."
              ].map((text, i) => (
                <ListItem key={i} sx={{ px: 0 }}>
                  <ListItemIcon><CheckCircle sx={{ color: '#10b981' }} /></ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
            <Button 
              fullWidth variant="contained" size="large" 
              onClick={() => setStep(1)}
              sx={{ py: 2, borderRadius: 4, fontWeight: 800, fontSize: '1.1rem' }}
            >
              I Understand, Continue
            </Button>
             <Button 
              fullWidth variant="contained" size="large" 
              onClick={() => setStep(1)}
              sx={{ py: 2, borderRadius: 4, fontWeight: 800, fontSize: '1.1rem', bgcolor: 'black', color: 'white' }}
            >
              Go Back
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // 2. PERIOD SELECTION VIEW (The 3 JLPT Sections)
  if (step === 1) {
    const sections = [
      { id: 'vocabulary', label: 'Language Knowledge', icon: <MenuBook />, time: '30 min', desc: 'Vocabulary & Grammar' },
      { id: 'reading', label: 'Reading', icon: <PlayLesson />, time: '40 min', desc: 'Comprehension' },
      { id: 'listening', label: 'Listening', icon: <Headphones />, time: '30 min', desc: 'Audio Tasks' },
    ];

    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', p: 4 }}>
        <Typography variant="h4" fontWeight={900} color="white" textAlign="center" sx={{ mb: 6 }}>Select Exam Period</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center">
          {sections.map((s) => (
            <Paper 
              key={s.id}
              onClick={() => setSelectedSection(s.id)}
              sx={{ 
                p: 4, width: { md: 280 }, cursor: 'pointer', borderRadius: 6,
                bgcolor: selectedSection === s.id ? '#6366f1' : '#1e293b',
                color: 'white', border: '2px solid',
                borderColor: selectedSection === s.id ? '#818cf8' : 'transparent',
                transition: '0.3s', '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              <Box sx={{ color: 'white', mb: 2 }}>{React.cloneElement(s.icon as React.ReactElement)}</Box>
              <Typography variant="h6" fontWeight={800}>{s.label}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>{s.desc}</Typography>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
              <Chip label={s.time} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.2)', color: 'white' }} />
            </Paper>
          ))}
        </Stack>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            disabled={!selectedSection}
            variant="contained" size="large" 
            onClick={() => setStep(2)}
            sx={{ px: 8, py: 2, borderRadius: 4, fontWeight: 800 }}
          >
            Start Selected Section
          </Button>
        </Box>
      </Box>
    );
  }

  // 3. ACTUAL EXAM VIEW (Your provided UI)
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', p: 4, color: 'white' }}>
      {/* Top Bar: Progress & Timer */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#1e293b', color: 'white' }}>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ flex: 1 }}>
          <Typography fontWeight={800}>JLPT N3: {selectedSection.toUpperCase()}</Typography>
          <Box sx={{ flex: 0.5 }}>
            <LinearProgress variant="determinate" value={40} sx={{ height: 10, borderRadius: 5, bgcolor: '#334155' }} />
          </Box>
          <Typography variant="caption">Question 8 of 20</Typography>
        </Stack>
        <Chip icon={<Timer sx={{ color: 'white !important' }} />} label="24:15 Remaining" color="error" sx={{ fontWeight: 700 }} />
        <ExitToAppIcon/>
      </Paper>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Question Area */}
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 5, borderRadius: 6, bgcolor: '#1e293b', color: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
              Which of the following is the most appropriate "Sonkeigo" (Respectful) form of the verb "Taberu"?
            </Typography>
            
            <RadioGroup value={selectedAnswer} onChange={(e) => setSelectedAnswer(e.target.value)}>
              {['Tabemasu', 'Meshiagarimasu', 'Itadakimasu', 'Taberaremasu'].map((opt) => (
                <Paper 
                  key={opt} 
                  sx={{ 
                    mb: 2, p: 1, px: 2, borderRadius: 3, transition: '0.2s',
                    bgcolor: selectedAnswer === opt ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid',
                    borderColor: selectedAnswer === opt ? '#6366f1' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <FormControlLabel 
                    value={opt} 
                    control={<Radio sx={{ color: 'white' }} />} 
                    label={opt} 
                    sx={{ width: '100%', m: 0, color: 'white' }} 
                  />
                </Paper>
              ))}
            </RadioGroup>

            <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
              <Button variant="outlined" sx={{ borderRadius: 3, flex: 1, color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>Previous</Button>
              <Button variant="contained" sx={{ borderRadius: 3, flex: 1 }}>Next Question</Button>
            </Stack>
          </Paper>
        </Box>

        {/* Question Map Sidebar */}
        <Paper sx={{ flex: 0.6, p: 3, borderRadius: 6, height: 'fit-content', bgcolor: '#1e293b', color: 'white' }}>
          <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ mb: 2 }}>Question Map</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
            {[...Array(20)].map((_, i) => (
              <Box 
                key={i} 
                sx={{ 
                  aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, fontSize: 12,
                  bgcolor: i < 7 ? '#10b981' : i === 7 ? '#6366f1' : 'rgba(255,255,255,0.05)',
                  color: 'white', fontWeight: 700
                }}
              >
                {i + 1}
              </Box>
            ))}
          </Box>
          <Button 
            fullWidth variant="contained" color="success" 
            startIcon={<Send />} 
            onClick={() => setStep(1)} // Go back to sections on submit
            sx={{ mt: 4, borderRadius: 3, fontWeight: 800 }}
          >
            Submit Section
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default MockTestPage;