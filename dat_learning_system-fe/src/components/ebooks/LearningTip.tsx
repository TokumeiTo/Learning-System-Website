import { Box, Typography, Paper } from '@mui/material';
import { LightbulbCircle } from '@mui/icons-material';

const LearningTip: React.FC<{ tip?: string }> = ({ tip = "Consistency beats intensity!" }) => (
    <Paper elevation={0} sx={{ p: 3, mb: 5, borderRadius: 5, border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: 2 }}>
        <LightbulbCircle sx={{ color: '#3b82f6', fontSize: 40 }} />
        <Box>
            <Typography variant="subtitle2" fontWeight={800} color="#1e40af">Learning Tip</Typography>
            <Typography variant="body2" color="#1e40af">{tip}</Typography>
        </Box>
    </Paper>
);

export default LearningTip;