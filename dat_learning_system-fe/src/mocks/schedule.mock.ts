import type { ScheduleItem } from "../types/schedule";

export const scheduleMock: ScheduleItem[] = [
  {
    id: "1",
    date: "2025-01-24",
    level: "N5",
    type: "lesson",
    category: "vocabulary",
    title: "N5 Vocabulary – Lesson 1",
    completed: false,
  },
  {
    id: "2",
    date: "2025-01-24",
    level: "N5",
    type: "quiz",
    category: "grammar",
    title: "N5 Grammar Quiz",
    completed: true,
  },
  {
    id: "3",
    date: "2025-01-25",
    level: "N5",
    type: "practice",
    category: "kanji",
    title: "Kanji Practice – 日・月",
    completed: false,
  },
];
