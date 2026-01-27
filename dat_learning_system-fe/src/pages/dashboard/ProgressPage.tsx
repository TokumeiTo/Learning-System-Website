import React from 'react';
import {
  Box, Typography, Stack, Paper, Button,
  Avatar, Chip, LinearProgress
} from '@mui/material';
import {
  FileDownload, TrendingUp, EmojiEvents,
  HistoryEdu, Timeline, WorkspacePremium
} from '@mui/icons-material';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import PageLayout from '../../components/layout/PageLayout';

// --- Mock Data ---
const SKILL_DATA = [
  { subject: 'IT (React/TS)', A: 90, fullMark: 100 },
  { subject: 'IT (Backend)', A: 65, fullMark: 100 },
  { subject: 'JP (Keigo)', A: 40, fullMark: 100 },
  { subject: 'JP (Kanji)', A: 85, fullMark: 100 },
  { subject: 'English (Speaking)', A: 70, fullMark: 100 },
  { subject: 'English (Writing)', A: 80, fullMark: 100 },
];

const MONTHLY_PROGRESS = [
  { month: 'Oct', hours: 10 },
  { month: 'Nov', hours: 25 },
  { month: 'Dec', hours: 18 },
  { month: 'Jan', hours: 1 },
];

const ProgressPage: React.FC = () => {
  return (
    <PageLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 6 } }}>

        {/* 1. Header with Export Action */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={900}>Performance</Typography>
            <Typography color="text.secondary">Detailed analysis of your professional development</Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            sx={{ borderRadius: 3, fontWeight: 700, textTransform: 'none' }}
          >
            Export PDF Report
          </Button>
        </Stack>

        {/* 2. Top Summary Cards (Flex Row) */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          {[
            { label: 'Courses Completed', val: '14', icon: <EmojiEvents />, color: '#6366f1' },
            { label: 'Total Learning Hours', val: '128h', icon: <Timeline />, color: '#10b981' },
            { label: 'Skill Score', val: '850', icon: <TrendingUp />, color: '#f59e0b' },
          ].map((item, i) => (
            <Paper key={i} sx={{ p: 3, borderRadius: 5, flex: 1, minWidth: 250, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color, width: 56, height: 56 }}>
                {item.icon}
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>{item.label}</Typography>
                <Typography variant="h5" fontWeight={900}>{item.val}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* 3. Main Analytics (Two Columns) */}
        <Box sx={{ display: 'flex', gap: 4, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>

          {/* Left: Skill Radar */}
          <Paper sx={{ p: 4, borderRadius: 6, flex: 1, minHeight: 450 }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 4 }}>Skill Proficiency Matrix</Typography>
            <Box sx={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <RadarChart data={SKILL_DATA}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                  <Radar
                    name="Employee"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Right: Learning Velocity & Progress */}
          <Stack spacing={4} sx={{ flex: 1.5 }}>
            <Paper sx={{ p: 4, borderRadius: 6 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Monthly Learning Velocity</Typography>
              <Box sx={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <LineChart data={MONTHLY_PROGRESS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1' }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 6 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Active Certifications</Typography>
              <Stack spacing={3}>
                {[
                  { name: 'Business Japanese (N3 Level)', progress: 85, color: '#f43f5e' },
                  { name: 'React Native Expert', progress: 40, color: '#0ea5e9' },
                  { name: 'Professional English C1', progress: 65, color: '#10b981' },
                ].map((cert, idx) => (
                  <Box key={idx}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WorkspacePremium sx={{ color: cert.color, fontSize: 20 }} />
                        <Typography variant="body2" fontWeight={700}>{cert.name}</Typography>
                      </Stack>
                      <Typography variant="caption" fontWeight={800}>{cert.progress}%</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={cert.progress}
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: cert.color } }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Box>

        {/* 4. Recent Achievements Footer */}
        <Paper sx={{ mt: 4, p: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#0f172a', color: 'white' }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar sx={{ width: 60, height: 60, bgcolor: '#334155' }}>
              <HistoryEdu sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={800}>Latest Milestone</Typography>
              <Typography sx={{ opacity: 0.7 }}>You completed "Database Design Fundamentals" with a 98% score!</Typography>
            </Box>
          </Stack>
          <Chip label="+50 Points" sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 900 }} />
        </Paper>
      </Box>
    </PageLayout>
  );
};

export default ProgressPage;