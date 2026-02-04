import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { Leaderboard } from '@mui/icons-material';

const RankingItem = ({ name, score, pos }: { name: string, score: string, pos: number }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="body2" fontWeight={800} color={pos === 1 ? '#fbbf24' : pos === 2 ? 'text.primary' : 'text.secondary'}>{pos}.</Typography>
            <Typography variant="body2">{name}</Typography>
        </Stack>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>{score}</Typography>
    </Stack>
);

const RankingSidebar: React.FC = () => {
    return (
        <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Quick Access</Typography>
            <Stack spacing={3}>
                <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Leaderboard sx={{ color: '#fbbf24' }} />
                        <Typography variant="subtitle1" fontWeight={700}>Department Ranking</Typography>
                    </Stack>
                    <Stack spacing={1.5}>
                        <RankingItem name="Engineering" score="4,200 pts" pos={1} />
                        <RankingItem name="Sales Dept" score="3,850 pts" pos={2} />
                        <RankingItem name="HR Team" score="2,100 pts" pos={3} />
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    );
};

export default RankingSidebar;