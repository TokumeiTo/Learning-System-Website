import { useState } from "react";

export function useLessonSidebar() {
    const [openLevels, setOpenLevels] = useState<Record<string, boolean>>({});
    const [openLessons, setOpenLessons] = useState<Record<string, boolean>>({});

    const toggle =
        (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) =>
        (key: string) => {
            setter((prev) => ({ ...prev, [key]: !prev[key] }));
        };

    return {
        openLevels,
        openLessons,
        toggleLevel: toggle(setOpenLevels),
        toggleLesson: toggle(setOpenLessons),
        setOpenLevels,
        setOpenLessons,
    };
}
