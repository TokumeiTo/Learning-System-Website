import api from "../hooks/useApi";
import type { 
    BulkSaveContentsRequest, 
    ClassroomView, 
    CreateLessonRequest, 
    Lesson, 
    ReOrderLessonsRequest,
    UpdateLessonRequest
} from "../types/classroom";

export const fetchClassroomData = async (courseId: string): Promise<ClassroomView> => {
    const res = await api.get(`/api/classroom/${courseId}`);
    return res.data;
};

export const createLesson = async (payload: CreateLessonRequest): Promise<Lesson> => {
    const response = await api.post('/api/classroom/lessons', payload);
    return response.data;
};

// --- NEW: Update Lesson ---
export const updateLesson = async (lessonId: string, payload: UpdateLessonRequest): Promise<Lesson> => {
    const response = await api.put(`/api/classroom/lessons/${lessonId}`, payload);
    return response.data;
};

// --- NEW: Delete Lesson ---
export const deleteLesson = async (lessonId: string): Promise<void> => {
    await api.delete(`/api/classroom/lessons/${lessonId}`);
};

export const reorderLessons = async (payload: ReOrderLessonsRequest): Promise<void> => {
    await api.put('/api/classroom/lessons/reorder', payload);
};

export const bulkSaveLessonContents = async (payload: BulkSaveContentsRequest): Promise<void> => {
    await api.post('/api/classroom/lessons/contents/bulk', payload);
};