import api from "../hooks/useApi";
import type { Course } from "../types/course";

export const getCourses = async (): Promise<Course[]> => {
    const res = await api.get("/api/courses");
    return res.data;
};

export const createCourse = async (formData: FormData): Promise<Course> => {
    const res = await api.post("/api/courses", formData);
    return res.data;
};

export const getCourseById = async (id: string): Promise<Course> => {
    const res = await api.get(`/api/courses/${id}`);
    return res.data;
};