import api from "../hooks/useApi";
import type {
    Test,
    LessonSubmission,
    LessonResult,
    AdminLessonStats,
    StudentPerformanceKPI,
    CategoryProgress,
    TestNameCheck
} from "../types_interfaces/test";

/**
 * ADMIN: Save or update the test content block
 */
export const saveTestContent = async (contentId: string | null, data: Test): Promise<void> => {
    const url = contentId ? `/api/Test/content/${contentId}` : `/api/Test/quiz`;
    const res = await api.post(url, data);
    return res.data;
};

/**
 * STUDENT: Submit all selected options for a lesson to be graded
 */
export const submitLessonTest = async (submission: LessonSubmission): Promise<LessonResult> => {
    const res = await api.post<LessonResult>("/api/Test/submit", submission);
    return res.data;
};

/**
 * STUDENT: Fetch personal attempt history for a specific lesson, quiz
 */
export const fetchMyAttemptHistory = async (
    lessonId?: string,
    testId?: string,
    level?: string // Add this parameter
): Promise<LessonResult[]> => {
    const res = await api.get<LessonResult[]>("/api/Test/my-history", {
        params: { lessonId, testId, level } // Pass it to the backend
    });
    return res.data;
};

/**
 * STUDENT: Fetch a specific quiz by ID
 */
export const fetchQuizById = async (testId: string): Promise<Test> => {
    const res = await api.get<Test>(`/api/Test/${testId}`);
    return res.data;
};

/**
 * GLOBAL: Fetch practice tests by level (N5-N1)
 */
export const fetchPracticeQuizzes = async (level: string, category: string): Promise<Test[]> => {
    const res = await api.get<Test[]>("/api/Test/practice", {
        params: { level, category }
    });
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

/**
 * STUDENT: Fetch progress percentages for all categories in a level (N5, N4, etc.)
 * Used for the circular progress dashboard.
 */
export const fetchGlobalStats = async (level: string): Promise<CategoryProgress[]> => {
    const res = await api.get<CategoryProgress[]>(`/api/Test/stats/${level}`);
    return res.data;
};

/**
 * ADMIN: Check if a test name already exists to warn about versioning
 */
export const checkTestName = async (title: string, isGlobal: boolean): Promise<TestNameCheck> => {
    const res = await api.get<TestNameCheck>("/api/Test/check-name", {
        params: { title, isGlobal }
    });
    return res.data;
};

/**
 * ADMIN: Fetch all archived and active versions of a specific test
 */
export const fetchTestVersions = async (title: string, isGlobal: boolean): Promise<Test[]> => {
    const res = await api.get<Test[]>(`/api/Test/admin/versions/${encodeURIComponent(title)}`, {
        params: { isGlobal }
    });
    return res.data;
};