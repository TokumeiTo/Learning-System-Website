import api from "../hooks/useApi";
import type { ClassroomView } from "../types/classroom";

export const fetchClassroomData = async (courseId: string): Promise<ClassroomView> => {
    const res = await api.get(`/api/classroom/${courseId}`);
    return res.data;
};