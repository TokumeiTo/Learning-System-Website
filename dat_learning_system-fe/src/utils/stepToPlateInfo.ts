// utils/lessonToPlateInfo.ts

import type { PlateInfo } from "../mocks/lessonSidebar.mock";
import type { stepPlate } from "../types/stepPlate";


export function stepsToPlateInfo(lesson: stepPlate): PlateInfo {
  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    isTest: lesson.isTest,
    correct: lesson.correct,
    wrong: lesson.wrong,
  };
}
