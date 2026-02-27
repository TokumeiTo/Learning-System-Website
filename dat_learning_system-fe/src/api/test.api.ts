import api from "../hooks/useApi";
import type { 
    Test, 
    LessonSubmission, 
    LessonResult, 
    LessonAttempt, 
    AdminLessonStats, 
    StudentPerformanceKPI 
} from "../types/test";

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

/**
 * STUDENT: Fetch personal attempt history for a specific lesson
 */
export const fetchMyAttemptHistory = async (lessonId: string): Promise<LessonAttempt[]> => {
    const res = await api.get(`/api/Test/my-attempts/${lessonId}`);
    return res.data;
};

/**
 * ADMIN: Fetch global stats for a lesson (Pass rates, average scores)
 */
export const fetchAdminLessonStats = async (lessonId: string): Promise<AdminLessonStats> => {
    const res = await api.get(`/api/Test/admin/stats/${lessonId}`);
    return res.data;
};

/**
 * ADMIN: Fetch KPI performance for an entire department (OrgUnit)
 */
export const fetchDepartmentKPI = async (orgUnitId: string): Promise<StudentPerformanceKPI[]> => {
    const res = await api.get(`/api/Test/admin/kpi/department/${orgUnitId}`);
    return res.data;
};