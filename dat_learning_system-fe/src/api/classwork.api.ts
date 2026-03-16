import api from "../hooks/useApi";
import type { 
    ClassworkTopic, 
    ClassworkItem, 
    ClassworkSubmission,
    CreateTopicPayload,
    CreateItemPayload,
    SubmitWorkPayload,
    GradeSubmissionPayload
} from "../types_interfaces/classwork";

/**
 * GENERAL: Fetch all classwork (topics, items, and student's own submission)
 */
export const fetchCourseClasswork = async (courseId: string): Promise<ClassworkTopic[]> => {
    const res = await api.get<ClassworkTopic[]>(`/api/Classwork/course/${courseId}`);
    return res.data;
};

/**
 * ADMIN: Create a new Topic (Gatekeeper)
 */
export const createClassworkTopic = async (payload: CreateTopicPayload): Promise<ClassworkTopic> => {
    const res = await api.post<ClassworkTopic>("/api/Classwork/topics", payload);
    return res.data;
};

/**
 * ADMIN: Delete a Topic and all its nested items
 */
export const deleteClassworkTopic = async (topicId: string): Promise<void> => {
    await api.delete(`/api/Classwork/topics/${topicId}`);
};
// Match the controller route: [HttpDelete("items/{id}")]
export const deleteClassworkItem = async (id: string) => {
    return await api.delete(`/api/Classwork/items/${id}`);
};

/**
 * ADMIN: Create an Assignment or Resource within a Topic
 */
export const createClassworkItem = async (payload: CreateItemPayload): Promise<ClassworkItem> => {
    const res = await api.post<ClassworkItem>("/api/Classwork/items", payload);
    return res.data;
};

/**
 * STUDENT: Submit work (Handles initial submission and overwrites)
 */
export const submitClasswork = async (payload: SubmitWorkPayload): Promise<ClassworkSubmission> => {
    const res = await api.post<ClassworkSubmission>("/api/Classwork/submit", payload);
    return res.data;
};

/**
 * ADMIN: Grade a specific student's submission
 */
export const gradeClassworkSubmission = async (
    submissionId: string, 
    payload: GradeSubmissionPayload
): Promise<ClassworkSubmission> => {
    const res = await api.put<ClassworkSubmission>(
        `/api/Classwork/submissions/${submissionId}/grade`, 
        payload
    );
    return res.data;
};