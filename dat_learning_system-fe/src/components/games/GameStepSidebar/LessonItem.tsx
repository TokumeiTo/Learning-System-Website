import {
    Box,
    Collapse,
    Divider,
    List,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import PlateItem from "./PlateItem";

type Props = {
    lessonKey: string;
    lesson: any;
    isOpen: boolean;
    toggle: (key: string) => void;
    activePlateId?: number;
    onSelectPlate: (
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


export default function LessonItem({
    lessonKey,
    lesson,
    isOpen,
    toggle,
    activePlateId,
    onSelectPlate,
}: Props) {
    return (
        <Box sx={{ mb: 1 }}>
            <ListItemButton sx={{ pl: 2 }} onClick={() => toggle(lessonKey)}>
                <ListItemText
                    primary={lesson.title}
                    primaryTypographyProps={{ fontWeight: 600 }}
                />
                {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 3 }}>
                    {lesson.plates.map((plate: any) => (
                        <PlateItem
                            key={plate.id}
                            title={plate.title}
                            active={plate.id === activePlateId}
                            description={plate.description}  // <-- add
                            isTest={plate.isTest}           // <-- add if it's a test plate
                            correct={plate.correct}         // <-- optional
                            wrong={plate.wrong}             // <-- optional
                            onClick={(plateInfo) => onSelectPlate(plate.id, plateInfo)} // send full info
                        />
                    ))}
                </List>
            </Collapse>


            <Divider sx={{ mt: 1 }} />
        </Box>
    );
}
