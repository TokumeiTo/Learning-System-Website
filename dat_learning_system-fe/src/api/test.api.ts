import api from "../hooks/useApi";
import type { Test, LessonSubmission, LessonResult } from "../types/test";

/**
 * ADMIN: Save or update the test content block
 */
export const saveTestContent = async (contentId: string, data: Test): Promise<void> => {
  await api.post(`/api/Test/content/${contentId}`, data);
};

/**
 * STUDENT: Submit all selected options for a lesson to be graded
 */
export const submitLessonTest = async (submission: LessonSubmission): Promise<LessonResult> => {
  const res = await api.post<LessonResult>("/api/Test/submit", submission);
  return res.data;
};