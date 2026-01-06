import { Box, Stack, Typography, useTheme } from "@mui/material";
import ProgressCircle from "../../chartAndProgress/ProgressCircle";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RadarShape } from "recharts";
import type { PlateInfo } from "../../../mocks/lessonSidebar.mock";
import SkillRow from "./SkillRow";
import Stat from "./Stat";

type Props = {
    progress: number;
    streak?: number;
    nextLesson?: string;
    selectedPlate?: PlateInfo; // clicked plate info
};

const radarData = [
    { skill: "Grammar", value: 80 },
    { skill: "Vocab", value: 60 },
    { skill: "Kanji", value: 50 },
    { skill: "Reading", value: 70 },
    { skill: "Writing", value: 40 },
    { skill: "Listening", value: 65 },
];

export default function CourseProgressSidebar({
    progress,
    streak = 5,
    nextLesson = "Lesson 4: Kanji Basics",
    selectedPlate,
}: Props) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: "sticky",
                top: "180px",
                width: { lg: 700, md: 400 },
                maxHeight: "calc(100vh - 210px)",
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: '1fr 1fr' },
                gridAutoRows: "min-content",
                justifyContent: 'end',
                gap: 2,
                p: 2,
            }}
        >
            {/* Selected Plate Info */}
            {selectedPlate && (
                <Box sx={{ ...cardStyle(theme), position: "relative", overflow: "hidden" }}>
                    {/* Accent Strip */}
                    <Box
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            width: 6,
                            bgcolor: selectedPlate.isTest
                                ? theme.palette.warning.main
                                : theme.palette.primary.main,
                        }}
                    />

                    <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700}>
                                {selectedPlate.isTest ? "📝 Test Review" : "📖 Lesson Overview"}
                            </Typography>

                            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                {selectedPlate.title}
                            </Typography>
                        </Box>

                        {/* Content */}
                        {selectedPlate.isTest ? (
                            <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", mt: 1 }}>
                                <Stat label="Correct" value={selectedPlate.correct ?? 0} />
                                <Stat label="Wrong" value={selectedPlate.wrong ?? 0} />
                                <Stat
                                    label="Total"
                                    value={(selectedPlate.correct ?? 0) + (selectedPlate.wrong ?? 0)}
                                />
                            </Box>
                        ) : (
                            <Typography
                                variant="body2"
                                sx={{ mt: 1, lineHeight: 1.6, color: "text.secondary" }}
                            >
                                {selectedPlate.description ??
                                    "This lesson introduces core concepts. Click below to start learning."}
                            </Typography>
                        )}

                        {/* CTA Button */}
                        <Box
                            onClick={() => {
                                // navigate later
                            }}
                            sx={{
                                mt: 3,
                                py: 1.8,
                                px: 2,
                                borderRadius: 2,
                                textAlign: "center",
                                cursor: "pointer",
                                bgcolor: selectedPlate.isTest
                                    ? theme.palette.warning.main
                                    : theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                fontWeight: 700,
                                letterSpacing: 0.3,
                                transition: "all 0.2s ease",
                                userSelect: "none",
                                "&:hover": {
                                    transform: "translateY(-1px)",
                                    boxShadow: `0 6px 18px ${selectedPlate.isTest
                                        ? theme.palette.warning.main
                                        : theme.palette.primary.main
                                        }55`,
                                },
                            }}
                        >
                            {selectedPlate.isTest ? "Review Test →" : "Next Lesson →"}
                            <br />
                            {!selectedPlate.isTest ? nextLesson : ""}
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Skills Radar */}
            <Box sx={{ ...cardStyle(theme), display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="subtitle1" mb={1}>
                    Skills Radar
                </Typography>
                <RadarChart
                    cx={150}
                    cy={125}
                    outerRadius={100}
                    width={300}
                    height={250}
                    data={radarData}
                    style={{
                        fontSize: '13px',
                        fontWeight: 'bold',
                    }}
                >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <RadarShape
                        name="Skill"
                        dataKey="value"
                        stroke={theme.palette.primary.main}
                        fill={theme.palette.primary.main}
                        fillOpacity={0.6}
                    />
                </RadarChart>
            </Box>




            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Daily Streak */}
                <Box sx={cardStyle(theme)}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                bgcolor: "rgba(255,120,0,0.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 24,
                            }}
                        >
                            🔥
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Daily Streak
                            </Typography>
                            <Typography variant="h4" fontWeight={700}>
                                {streak}
                                <Typography component="span" variant="subtitle2">
                                    &nbsp;days
                                </Typography>
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* Overall Progress */}
                <Box sx={cardStyle(theme)} maxHeight={200}>
                    <Typography variant="subtitle1">Overall Progress</Typography>
                    <ProgressCircle value={progress} />
                    <Typography variant="body2">{progress}% completed</Typography>
                </Box>
            </Box>

            {/* Skill Breakdown */}
            <Box sx={{ ...cardStyle(theme), textAlign: "left" }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                    🎯 Skill Breakdown
                </Typography>
                <Stack spacing={1.5}>
                    {radarData.map((r) => (
                        <SkillRow key={r.skill} label={r.skill} value={r.value} />
                    ))}
                </Stack>
            </Box>

        </Box>
    );
}

// Shared card style
const cardStyle = (theme: any) => ({
    bgcolor: theme.palette.background.blur,
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    borderRadius: 3,
    p: 2,
    textAlign: "center",
    boxShadow: `0 2px 8px ${theme.palette.primary.main}`,
});
