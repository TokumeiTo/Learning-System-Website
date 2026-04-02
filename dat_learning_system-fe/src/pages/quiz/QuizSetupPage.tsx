import { Box, Card, Tab, Tabs, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import ProgressCircle from "../../components/chartAndProgress/ProgressCircle";
import JapaneseTabLoader from "../../components/feedback/TabLoader";
import { fetchGlobalStats } from "../../api/test.api";
import type { CategoryProgress } from "../../types_interfaces/test";

const LEVELS = ["N5", "N4", "N3", "N2", "N1"] as const;
type Level = typeof LEVELS[number];

export default function QuizSetupPage() {
    const [level, setLevel] = useState<Level>("N5");
    const [stats, setStats] = useState<CategoryProgress[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
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
                // Keep the loader visible for a smooth float cycle
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
                
                {loading ? (
                    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <JapaneseTabLoader />
                    </Box>
                ) : stats.length > 0 ? (
                    /* The Card Grid */
                    <Box sx={{ 
                        display: "flex", 
                        justifyContent: "center", 
                        flexWrap: "wrap", 
                        gap: 3, 
                        width: '100%',
                        maxWidth: '900px'
                    }}>
                        {stats.map((item) => (
                            <Card
                                elevation={0}
                                key={item.category}
                                onClick={() => handleClick(item.category)}
                                sx={{ 
                                    textAlign: "center", 
                                    width: { xs: "45%", sm: "40%" }, 
                                    p: 3, 
                                    cursor: "pointer", 
                                    minWidth: '160px',
                                    borderRadius: '24px',
                                    bgcolor: '#2d3748', 
                                    border: '1px solid #4a5568',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': { 
                                        transform: 'scale(1.03)',
                                        bgcolor: '#334155'
                                    }
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: '900', color: '#f6ad55', mb: 2 }}>
                                    {item.category}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                                    <ProgressCircle value={item.progressPercentage} />
                                </Box>
                                
                                <Typography variant="caption" sx={{ color: '#a0aec0', fontWeight: 'bold' }}>
                                    {item.passedCount} / {item.totalCount} COMPLETED
                                </Typography>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    /* Styled Empty State - Triggered when stats.length === 0 */
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flex: 1,
                        textAlign: 'center',
                        color: '#a0aec0'
                    }}>
                        <Typography sx={{ fontSize: 60, mb: 2, opacity: 0.5 }}>📂</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                            No tests available for {level}
                        </Typography>
                        <Typography variant="body2" sx={{ maxWidth: 300, mt: 1 }}>
                            We haven't added practice materials for this level yet. Check back soon!
                        </Typography>
                    </Box>
                )}

                {/* THE PILL NAVIGATOR */}
                <Box sx={{ 
                    position: 'fixed', 
                    bottom: 30, 
                    bgcolor: '#34a8fb', 
                    borderRadius: '50px', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    px: 1,
                    py: 0.5,
                    zIndex: 1000
                }}>
                    <Tabs 
                        value={level} 
                        onChange={(_, v) => setLevel(v)} 
                        centered 
                        TabIndicatorProps={{ style: { display: 'none' } }}
                        sx={{ 
                            minHeight: '44px',
                            '& .MuiTabs-flexContainer': { gap: '4px' },
                            '& .MuiTab-root': { 
                                color: "white", 
                                fontWeight: '900',
                                minWidth: '80px',
                                minHeight: '40px',
                                borderRadius: '40px',
                                fontSize: '0.9rem',
                                transition: '0.2s',
                                '&.Mui-selected': { 
                                    bgcolor: 'white', 
                                    color: '#34a8fb' 
                                } 
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