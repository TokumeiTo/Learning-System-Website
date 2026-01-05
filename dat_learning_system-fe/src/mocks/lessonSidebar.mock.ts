// src/mocks/lessonSidebar.mock.ts

export type LessonPlateType = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  locked: boolean;

  // ✅ add these
  isTest?: boolean;
  correct?: number;
  wrong?: number;
};

// types/PlateInfo.ts
export type PlateInfo = {
  id: number;
  title: string;
  description?: string;

  isTest?: boolean;
  correct?: number;
  wrong?: number;
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
    course: "minnanonihongo",
    levels: [
      {
        id: 1,
        title: "N5 - Beginner",
        lessons: [
          {
            id: 1,
            title: "Lesson 1",
            plates: [
              {
                id: 1,
                title: "Hiragana",
                description: "Learn あ・い・う・え・お and basic pronunciation",
                completed: true,
                locked: false,
              },
              {
                id: 2,
                title: "Katakana",
                description: "Master ア・イ・ウ・エ・オ and loanwords",
                completed: false,
                locked: false,
              },
              {
                id: 3,
                title: "Grammar",
                description: "Basic sentence structure using です / ます",
                completed: false,
                locked: false,
              },
              {
                id: 4,
                title: "Reading",
                description: "Read and understand: 私のなまえは〜です",
                completed: false,
                locked: false,
              },

              // 🔁 Review plates
              {
                id: 5,
                title: "Lesson 1 Review",
                description: "Review all contents from Lesson 1",
                isTest: true,
                completed: false,
                locked: false,
              },

              // 🧪 Test plate
              {
                id: 6,
                title: "Lesson 1 Test",
                description: "Test your understanding of Lesson 1",
                isTest: true,
                correct: 7,
                wrong: 3,
                completed: false,
                locked: true,
              },
            ],
          },

          {
            id: 2,
            title: "Lesson 2",
            plates: [
              {
                id: 11,
                title: "Hiragana 2",
                description: "Learn か・き・く・け・こ",
                completed: false,
                locked: true,
              },
              {
                id: 12,
                title: "Grammar 2",
                description: "Particles は / の",
                completed: false,
                locked: true,
              },
              {
                id: 13,
                title: "Hiragana 2",
                description: "Learn か・き・く・け・こ",
                completed: false,
                locked: true,
              },
              {
                id: 14,
                title: "Grammar 2",
                description: "Particles は / の",
                completed: false,
                locked: true,
              },
              {
                id: 15,
                title: "Hiragana 2",
                description: "Learn か・き・く・け・こ",
                completed: false,
                locked: true,
              },
              {
                id: 16,
                title: "Grammar 2",
                description: "Particles は / の",
                completed: false,
                locked: true,
              },
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
