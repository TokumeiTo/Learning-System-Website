import { Box, Typography } from "@mui/material";
import ProgressCircle from "../../chartAndProgress/ProgressCircle";
import CalendarHeatmap from "../../chartAndProgress/DailyLessonChart";

type Props = {
    progress: number; // 0-100
};

export default function CourseProgressSidebar({ progress }: Props) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "sticky",
                top: "210px",
                p: 2,
                bgcolor: "transparent",
                borderRadius: 2,
                width: { xs: "100px", md: 500, lg: 800 },
                maxHeight: "calc(100vh - 230px)",
            }}
        >

            <Box sx={{
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                bgcolor: 'background.paper',
                boxShadow: '1px 1px 5px #0084ffff',
                p:5,
                borderRadius:5
            }}>
                <Typography variant="h6" mb={2} sx={{ userSelect: 'none' }}>
                    Course Progress
                </Typography>
                <ProgressCircle value={progress} streak={5} />
                <Typography mt={1} variant="body2" sx={{ userSelect: 'none' }}>
                    {progress}% completed
                </Typography>
            </Box>

            <CalendarHeatmap />
        </Box>
    );
}
