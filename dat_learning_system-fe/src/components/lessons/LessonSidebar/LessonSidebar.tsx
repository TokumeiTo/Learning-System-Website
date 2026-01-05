import { Box, Typography } from "@mui/material";
import { lessonSidebarData } from "../../../mocks/lessonSidebar.mock";
import type { LessonSidebarProps } from "../../../types/lessonSidebar";
import { useLessonSidebar } from "./useLessonSidebar";
import LevelItem from "./LevelItem";
import { useMemo } from "react";

export default function LessonSidebar({
    selectedCourse,
    activePlateId,
    onSelectPlate,
}: LessonSidebarProps) {
    const {
        openLevels,
        openLessons,
        toggleLevel,
        toggleLesson,
    } = useLessonSidebar();

    const courseItem = useMemo(
        () => lessonSidebarData.find((c) => c.course === selectedCourse),
        [selectedCourse]
    );

    if (!courseItem) return null;

    return (
        <Box
            sx={{
                position: "absolute",
                top: "200px",
                p: 2,
                bgcolor: "background.paper",
                boxShadow: "0px 0px 5px rgba(0,132,255,1)",
                borderRadius: 2,
                overflowY: "auto",
                minWidth: {xs: '87%', md: '200px', lg:'400px'},
                height: "calc(100vh - 250px)",
                zIndex: 5,
            }}
        >
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 700,
                    position: "sticky",
                    top: -17,
                    bgcolor: "background.paper",
                    zIndex: 2,
                    borderBottom: "1px solid rgba(0,132,255,0.3)",
                    p: 2,
                }}
            >
                {courseItem.course.toUpperCase()}
            </Typography>

            {courseItem.levels.map((level) => {
                const levelKey = `${courseItem.course}-${level.id}`;

                return (
                    <LevelItem
                        key={levelKey}
                        levelKey={levelKey}
                        level={level}
                        isOpen={openLevels[levelKey]}
                        toggleLevel={toggleLevel}
                        openLessons={openLessons}
                        toggleLesson={toggleLesson}
                        activePlateId={activePlateId}
                        onSelectPlate={(lessonTitle, plateId) =>
                            onSelectPlate(
                                courseItem.course,
                                level.title,
                                lessonTitle,
                                plateId
                            )
                        }
                    />
                );
            })}
        </Box>
    );
}
