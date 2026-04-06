import api from "../hooks/useApi";

export interface ProgressRequest {
    lessonId: string;
    seconds: number;
}

export interface LessonProgress {
    lessonId: string;
    timeSpentSeconds: number;
    isCompleted: boolean;
    lastAccessedAt: string;
    lessonTitle: string;
}

export interface LessonAttempt {
    id: string;
    userId: string;
    lessonId: string | null;
    testId: string;
    score: number;
    maxScore: number;
    percentage: number;
    isPassed: boolean;
    attempts: number;
    attemptedAt: string;
}

export const sendHeartbeat = async (payload: ProgressRequest): Promise<void> => {
    // We don't necessarily need to return the data here, 
    // just fire and forget to keep it performant
    await api.patch('/api/LessonProgress/heartbeat', payload);
};

export const getLessonProgress = async (lessonId: string): Promise<LessonProgress> => {
    const res = await api.get(`/api/LessonProgress/${lessonId}`);
    return res.data;
};

export const markLessonComplete = async (lessonId: string) => {
    return await api.post(`api/LessonProgress/${lessonId}/complete`);
};

export const getCourseProgressForUser = async (courseId: string, userId: string): Promise<LessonProgress[]> => {
    const res = await api.get(`/api/LessonProgress/course/${courseId}/user/${userId}`);
    return res.data;
};

export const getCourseAttemptsForUser = async (courseId: string, userId: string): Promise<LessonAttempt[]> => {
    const res = await api.get(`/api/Test/admin/course/${courseId}/student/${userId}/history`);
    return res.data;
};