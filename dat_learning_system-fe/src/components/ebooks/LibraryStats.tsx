import { Box, Typography, Stack } from '@mui/material';

interface StatsProps {
    totalBooks: number;
    totalMinutes: number;
    openedCount: number;
    downloadedCount: number;
}

const LibraryStats: React.FC<StatsProps> = ({ totalBooks, totalMinutes, openedCount, downloadedCount }) => (
    <Stack direction="row" spacing={3} sx={{ display: 'flex', mb: 4, flexWrap: 'wrap', gap: 3 }}>
        <Box>
            <Typography variant="h4" fontWeight={900} color="primary">{totalBooks}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL BOOKS</Typography>
        </Box>

        <Box sx={{ borderLeft: '1px solid #e2e8f0', pl: 3 }}>
            <Typography variant="h4" fontWeight={900} color="success.main">{openedCount}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>READ</Typography>
        </Box>

        <Box sx={{ borderLeft: '1px solid #e2e8f0', pl: 3 }}>
            <Typography variant="h4" fontWeight={900} color="info.main">{downloadedCount}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>DOWNLOADED</Typography>
        </Box>

        <Box sx={{ borderLeft: '1px solid #e2e8f0', pl: 3 }}>
            <Typography variant="h4" fontWeight={900} color="secondary">
                {totalMinutes} <span style={{ fontSize: '1rem' }}>MINS</span>
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>TIME SPENT</Typography>
        </Box>
    </Stack>
);

export default LibraryStats;