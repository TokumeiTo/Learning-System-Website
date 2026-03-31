import api from "../hooks/useApi";
import type { CourseSummary, CourseDetail, Course } from "../types_interfaces/course";

// Returns a list of full details (or summaries, depending on your GetAll logic)
export const getCourses = async (): Promise<CourseDetail[]> => {
    const res = await api.get("/api/courses");
    console.log(res.data);
    return res.data;
};

// Returns CourseDetail because this page NEEDS the syllabus/lessons
export const getCourseById = async (id: string): Promise<CourseDetail> => {
    const res = await api.get(`/api/courses/${id}`);
    return res.data;
};

// Returns CourseSummary (The light version we just created in C#)
export const createCourse = async (formData: FormData): Promise<Course> => {
    const res = await api.post("/api/courses", formData);
    return res.data;
};

// Returns CourseSummary (The light version)
export const updateCourse = async (id: string, formData: FormData): Promise<CourseSummary> => {
    const res = await api.put(`/api/courses/${id}`, formData);
    return res.data;
};

// Soft Delete (Close)
export const closeCourse = async (id: string): Promise<void> => {
    await api.delete(`/api/courses/${id}`);
};

// Hard Delete (Purge) - Optional safety check
export const purgeCourse = async (id: string): Promise<void> => {
    await api.delete(`/api/courses/${id}/purge`);
};