import { Box, Typography, Stack, Paper, LinearProgress, Chip, alpha, useTheme } from '@mui/material';
import { People, AssignmentTurnedIn, Warning, TrendingUp, MoreVert } from '@mui/icons-material';
import PageLayout from '../../components/layout/PageLayout';

const AdminDashboard = () => {
    const theme = useTheme();

    return (
        <PageLayout>
            <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* HEADER SECTION */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h4" fontWeight={900} letterSpacing={-1}>
                            Management Console
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Monitoring student progress and course health.
                        </Typography>
                    </Box>
                    <Chip
                        icon={<TrendingUp sx={{ fontSize: '1rem !important' }} />}
                        label="System Live"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 800, borderRadius: 2 }}
                    />
                </Stack>

                {/* LAYER 1: STATS TILES (Flex Row) */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    sx={{ width: '100%' }}
                >
                    <StatTile title="Total Enrolled" value="1,284" icon={<People />} color={theme.palette.primary.main} />
                    <StatTile title="Completion Rate" value="72%" icon={<AssignmentTurnedIn />} color={theme.palette.secondary.main} />
                    {/* We use the "Attempts" logic here to flag struggling students */}
                    <StatTile title="Needs Support" value="14" icon={<Warning />} color={theme.palette.error.main} subtitle="Students with 3+ fails" />
                </Stack>

                {/* LAYER 2: MAIN CONTENT (Flex Row with Sidebar) */}
                <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ alignItems: 'stretch' }}>

                    {/* LEFT: Course Performance (Flexible Growth) */}
                    <Paper sx={{ p: 3, flex: 2, borderRadius: 5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight={800} mb={3}>Active Courses</Typography>
                        <Stack spacing={2}>
                            <CourseRow name="JLPT N5: Kanji Mastery" students={420} progress={85} status="Published" />
                            <CourseRow name="JLPT N4: Grammar Guide" students={156} progress={42} status="Published" />
                            <CourseRow name="Business Japanese" students={89} progress={12} status="Draft" />
                        </Stack>
                    </Paper>

                    {/* RIGHT: Recent Attempts Feed (Fixed Width Sidebar) */}
                    <Paper sx={{ p: 3, width: { xs: '100%', lg: 350 }, borderRadius: 5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight={800} mb={3}>Live Test Feed</Typography>
                        <Stack spacing={2}>
                            {/* Displaying that "Attempts" counter we built into the DB */}
                            <LiveAttemptItem user="Kyaw Zayar" test="N5 Vocabulary" attempt={1} score={100} passed={true} />
                            <LiveAttemptItem user="Hla Hla" test="N5 Particles" attempt={3} score={45} passed={false} />
                            <LiveAttemptItem user="Min Thu" test="Kanji Set A" attempt={1} score={90} passed={true} />
                        </Stack>
                    </Paper>

                </Stack>
            </Box>
        </PageLayout>
    );
};

// --- SUB-COMPONENTS (Clean Flex Items) ---

const StatTile = ({ title, value, icon, color, subtitle }: any) => (
    <Paper sx={{
        p: 3, flex: 1, borderRadius: 5, border: '1px solid', borderColor: 'divider',
        background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, transparent 100%)`
    }}>
        <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha(color, 0.1), color: color, display: 'flex' }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>{title}</Typography>
                <Typography variant="h5" fontWeight={900}>{value}</Typography>
                {subtitle && <Typography variant="caption" color="error.main" fontWeight={600}>{subtitle}</Typography>}
            </Box>
        </Stack>
    </Paper>
);

const CourseRow = ({ name, students, progress, status }: any) => (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2, borderRadius: 3, '&:hover': { bgcolor: 'action.hover' } }}>
        <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={800}>{name}</Typography>
            <Typography variant="caption" color="text.secondary">{students} Students Enrolled</Typography>
        </Box>
        <Box sx={{ width: 150, display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="caption" fontWeight={700}>{progress}% Avg. Completion</Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 5 }} color="secondary" />
        </Box>
        <Chip label={status} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
    </Stack>
);

const LiveAttemptItem = ({ user, test, attempt, score, passed }: any) => (
    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ p: 1.5, borderRadius: 3, bgcolor: 'action.hover' }}>
        <Box sx={{ flex: 1 }}>
            <Typography variant="caption" fontWeight={900} display="block">{user}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{test} • Attempt #{attempt}</Typography>
        </Box>
        <Typography variant="subtitle2" fontWeight={900} color={passed ? 'success.main' : 'error.main'}>
            {score}%
        </Typography>
    </Stack>
);

export default AdminDashboard;