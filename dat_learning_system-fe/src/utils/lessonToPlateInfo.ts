// utils/lessonToPlateInfo.ts

import type { PlateInfo } from "../mocks/lessonSidebar.mock";
import type { Lesson } from "../types/lesson";


export function lessonToPlateInfo(lesson: Lesson): PlateInfo {
  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    isTest: lesson.isTest,
    correct: lesson.correct,
    wrong: lesson.wrong,
  };
}
