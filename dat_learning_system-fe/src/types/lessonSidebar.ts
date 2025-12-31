// A plate is just a string
export type LessonPlateType = string;

// Each lesson has a title and optionally plates
export type LessonItemType = {
  title: string;
  plates?: LessonPlateType[];
};

// Each level has a level name and an array of lessons
export type LevelType = {
  level: string;
  lessons: LessonItemType[];
};

// The sidebar data is keyed by course name
export type LessonSidebarDataType = {
  [course: string]: LevelType[];
};

export type LessonSidebarProps = {
    selectedCourse: string;
    activePlateId?: number;
    onSelectPlate: (
        course: string,
        level: string,
        lesson: string,
        plateId: number
    ) => void;
};
