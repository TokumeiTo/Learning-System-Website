import { Box, Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import LessonItem from "./LessonItem";

type Props = {
    levelKey: string;
    level: any;
    isOpen: boolean;
    toggleLevel: (key: string) => void;
    openLessons: Record<string, boolean>;
    toggleLesson: (key: string) => void;
    activePlateId?: number;
    onSelectPlate: (
        lessonTitle: string,
        plateId: number,
        plateInfo: {
            title: string;
            description?: string;
            isTest?: boolean;
            correct?: number;
            wrong?: number;
        }
    ) => void;
};


export default function LevelItem({
    levelKey,
    level,
    isOpen,
    toggleLevel,
    openLessons,
    toggleLesson,
    activePlateId,
    onSelectPlate,
}: Props) {
    return (
        <Box sx={{ mb: 1, borderBottom: "1px solid rgba(0,132,255,0.2)" }}>
            <ListItemButton onClick={() => toggleLevel(levelKey)}>
                <ListItemText primary={level.title} />
                {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 3 }}>
                    {level.lessons.map((lesson: any) => {
                        const lessonKey = `${levelKey}-lesson-${lesson.id}`;

                        return (
                            <LessonItem
                                key={lessonKey}
                                lessonKey={lessonKey}
                                lesson={lesson}
                                isOpen={openLessons[lessonKey]}
                                toggle={toggleLesson}
                                activePlateId={activePlateId}
                                onSelectPlate={(plateId, plateInfo) =>
                                    onSelectPlate(lesson.title, plateId, plateInfo)
                                }
                            />
                        );
                    })}
                </List>
            </Collapse>
        </Box>
    );
}
