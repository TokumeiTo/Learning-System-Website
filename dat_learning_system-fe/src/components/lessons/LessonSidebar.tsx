import React from "react";
import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Collapse,
    Divider,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { lessonSidebarData, type CourseSidebarType } from "../../mocks/lessonSidebar.mock";

type Props = {
    selectedCourse: string;
    onSelectPlate: (
        course: string,
        level: string,
        lesson: string,
        plateId: number
    ) => void;
};

export default function LessonSidebar({ selectedCourse, onSelectPlate }: Props) {
    const [openLevels, setOpenLevels] = React.useState<Record<string, boolean>>({});

    const toggleLevel = (levelKey: string) => {
        setOpenLevels((prev) => ({ ...prev, [levelKey]: !prev[levelKey] }));
    };

    const courseItem: CourseSidebarType | undefined = lessonSidebarData.find(
        (c) => c.course === selectedCourse
    );

    if (!courseItem) return null;

    return (
        <Box
            sx={{
                p: 2,
                bgcolor: "background.paper.default",
                boxShadow: "0px 0px 10px rgba(0, 132, 255, 1)",
                borderRadius: 2,
                maxHeight: "80vh",
                overflowY: "auto",
            }}
        >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {courseItem.course.toUpperCase()}
            </Typography>

            {courseItem.levels.map((levelItem) => {
                const levelKey = `${courseItem.course}-${levelItem.id}`;
                return (
                    <Box key={levelKey} sx={{ mb: 1 }}>
                        <ListItemButton onClick={() => toggleLevel(levelKey)}>
                            <ListItemText primary={levelItem.title} />
                            {openLevels[levelKey] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={openLevels[levelKey]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 3 }}>
                                {levelItem.lessons.map((lessonItem) => {
                                    const lessonKey = `${levelKey}-lesson-${lessonItem.id}`;
                                    return (
                                        <Box key={lessonKey} sx={{ mb: 1 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 600, mb: 0.5 }}
                                            >
                                                {lessonItem.title}
                                            </Typography>

                                            <List component="div" disablePadding sx={{ pl: 2 }}>
                                                {lessonItem.plates.map((plate) => {
                                                    const plateKey = `${lessonKey}-plate-${plate.id}`;
                                                    return (
                                                        <ListItemButton
                                                            key={plateKey}
                                                            sx={{ pl: 2 }}
                                                            onClick={() =>
                                                                onSelectPlate(
                                                                    courseItem.course,
                                                                    levelItem.title,
                                                                    lessonItem.title,
                                                                    plate.id
                                                                )
                                                            }
                                                        >
                                                            <ListItemText primary={plate.title} />
                                                        </ListItemButton>
                                                    );
                                                })}
                                            </List>
                                            <Divider sx={{ mt: 1, mb: 1 }} />
                                        </Box>
                                    );
                                })}
                            </List>
                        </Collapse>
                    </Box>
                );
            })}
        </Box>
    );
}
