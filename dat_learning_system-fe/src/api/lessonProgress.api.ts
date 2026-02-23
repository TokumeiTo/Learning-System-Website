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