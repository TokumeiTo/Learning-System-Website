import { Box, Card, Tab, Tabs, Typography, Stack, alpha, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import ProgressCircle from "../../components/chartAndProgress/ProgressCircle";
import JapaneseTabLoader from "../../components/feedback/TabLoader";
import { fetchGlobalStats } from "../../api/test.api";
import type { CategoryProgress } from "../../types_interfaces/test";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuBookIcon from '@mui/icons-material/MenuBook'; // Example icon

const LEVELS = ["N5", "N4", "N3", "N2", "N1"] as const;
type Level = typeof LEVELS[number];

export default function QuizSetupPage() {
    const [level, setLevel] = useState<Level>("N5");
    const [stats, setStats] = useState<CategoryProgress[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const loadProgress = async () => {
            setLoading(true);
            try {
                const data = await fetchGlobalStats(level);
                setStats(data);
            } catch (error) {
                console.error("Failed to load DB stats", error);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };
        loadProgress();
    }, [level]);

    const handleClick = (category: string) => {
        navigate(`/quiz/selection/${level}/${category}`);
    };

    return (
        <PageLayout>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexDirection: 'column', 
                p: { xs: 2, md: 6 }, 
                pb: 14, 
                minHeight: '80vh',
            }}>
                
                {/* Header Title for Context */}
                {!loading && stats.length > 0 && (
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h3" fontWeight={900} gutterBottom>
                            Practice Mode
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Select a category to view your {level} progress and start a quiz.
                        </Typography>
                    </Box>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <JapaneseTabLoader />
                    </Box>
                ) : stats.length > 0 ? (
                    <Box sx={{ 
                        display: "flex", 
                        justifyContent: "center", 
                        flexWrap: "wrap", 
                        gap: 4, 
                        width: '100%',
                        maxWidth: '1000px'
                    }}>
                        {stats.map((item) => (
                            <Card
                                elevation={0}
                                key={item.category}
                                onClick={() => handleClick(item.category)}
                                sx={{ 
                                    flex: { xs: '1 1 100%', sm: '1 1 280px' },
                                    maxWidth: { sm: '320px' },
                                    p: 3, 
                                    cursor: "pointer", 
                                    borderRadius: '28px',
                                    bgcolor: 'background.paper', 
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    position: 'relative',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    overflow: 'visible',
                                    '&:hover': { 
                                        transform: 'translateY(-8px)',
                                        borderColor: 'primary.main',
                                        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                                        '& .arrow-icon': { opacity: 1, transform: 'translateX(0)' }
                                    }
                                }}
                            >
                                {/* Top Icon/Badge Decoration */}
                                <Box sx={{ 
                                    position: 'absolute', 
                                    top: -20, 
                                    bgcolor: 'primary.main', 
                                    color: 'white', 
                                    p: 1.5, 
                                    borderRadius: '16px',
                                    boxShadow: theme.shadows[4]
                                }}>
                                    <MenuBookIcon fontSize="small" />
                                </Box>

                                <Typography variant="h5" sx={{ fontWeight: '900', mt: 2, mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    {item.category}
                                </Typography>
                                
                                <Box sx={{ mb: 3, transform: 'scale(1.1)' }}>
                                    <ProgressCircle value={item.progressPercentage} />
                                </Box>
                                
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', mt: 'auto' }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', display: 'block' }}>
                                            COMPLETION
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: '900', color: 'primary.main' }}>
                                            {item.passedCount} / {item.totalCount} Tests
                                        </Typography>
                                    </Box>
                                    
                                    <ChevronRightIcon 
                                        className="arrow-icon"
                                        sx={{ 
                                            opacity: 0, 
                                            transform: 'translateX(-10px)', 
                                            transition: '0.3s',
                                            color: 'primary.main'
                                        }} 
                                    />
                                </Stack>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography sx={{ fontSize: 80, mb: 2 }}>empty</Typography>
                        <Typography variant="h5" fontWeight="bold">No Content Found</Typography>
                        <Typography color="text.secondary">We're still preparing {level} materials.</Typography>
                    </Box>
                )}

                {/* THE PILL NAVIGATOR */}
                <Box sx={{ 
                    position: 'fixed', 
                    bottom: 30, 
                    bgcolor: 'primary.main', 
                    borderRadius: '50px', 
                    boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                    px: 1, py: 0.5,
                    zIndex: 1000,
                    border: '1px solid',
                    borderColor: alpha('#fff', 0.2)
                }}>
                    <Tabs 
                        value={level} 
                        onChange={(_, v) => setLevel(v)} 
                        centered 
                        TabIndicatorProps={{ style: { display: 'none' } }}
                        sx={{ 
                            minHeight: '48px',
                            '& .MuiTab-root': { 
                                color: alpha('#fff', 0.7), 
                                fontWeight: '900',
                                minWidth: '80px',
                                borderRadius: '40px',
                                fontSize: '0.95rem',
                                '&.Mui-selected': { color: 'primary.main', bgcolor: 'white' } 
                            } 
                        }}
                    >
                        {LEVELS.map((lvl) => <Tab key={lvl} label={lvl} value={lvl} disableRipple />)}
                    </Tabs>
                </Box>
            </Box>
        </PageLayout>
    );
}