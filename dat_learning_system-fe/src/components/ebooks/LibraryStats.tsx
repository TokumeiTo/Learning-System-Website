import { Box, Typography, Stack } from '@mui/material';

interface StatsProps {
    readCount: number;
    inProgress: number;
    targetLevel: string;
}

const LibraryStats: React.FC<StatsProps> = ({ readCount, inProgress, targetLevel }) => (
    <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Box>
            <Typography variant="h4" fontWeight={900} color="primary">{readCount}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL BOOKS</Typography>
        </Box>
        <Box sx={{ borderLeft: '1px solid #e2e8f0', pl: 3 }}>
            <Typography variant="h4" fontWeight={900} color="secondary">{inProgress}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>IN PROGRESS</Typography>
        </Box>
        <Box sx={{ borderLeft: '1px solid #e2e8f0', pl: 3 }}>
            <Typography variant="h4" fontWeight={900}>{targetLevel}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>TARGET LEVEL</Typography>
        </Box>
    </Stack>
);

export default LibraryStats;