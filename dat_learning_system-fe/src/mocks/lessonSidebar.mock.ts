// src/mocks/lessonSidebar.mock.ts

export type LessonPlateType = {
  id: number;
  title: string;
  completed: boolean;
  locked: boolean;
};

export type LessonItemType = {
  id: number;
  title: string;
  plates: LessonPlateType[];
};

export type LevelType = {
  id: number;
  title: string;
  lessons: LessonItemType[];
};

export type CourseSidebarType = {
  course: string;
  levels: LevelType[];
};

export const lessonSidebarData: CourseSidebarType[] = [
  {
    course: "Minna no Nihongo",
    levels: [
      {
        id: 1,
        title: "N5",
        lessons: [
          {
            id: 1,
            title: "Lesson 1",
            plates: [
              { id: 1, title: "Hiragana", completed: true, locked: false },
              { id: 2, title: "Katakana", completed: false, locked: false },
              { id: 3, title: "Grammar", completed: false, locked: false },
              { id: 4, title: "Reading", completed: false, locked: true },
              { id: 5, title: "Test", completed: false, locked: true },
              { id: 6, title: "Test", completed: false, locked: true },
              { id: 7, title: "Test", completed: false, locked: true },
            ],
          },
          {
            id: 2,
            title: "Lesson 2",
            plates: [
              { id: 8, title: "Hiragana 2", completed: false, locked: true },
              { id: 9, title: "Grammar 2", completed: false, locked: true },
            ],
          },
        ],
      },
    ],
  },
  {
    course: "shinkanzen",
    levels: [
      {
        id: 1,
        title: "N5",
        lessons: [
          {
            id: 1,
            title: "Lesson 1",
            plates: [
              { id: 1, title: "Grammar", completed: false, locked: false },
              { id: 2, title: "Reading", completed: false, locked: false },
            ],
          },
        ],
      },
    ],
  },
];
