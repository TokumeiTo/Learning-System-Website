import api from "../hooks/useApi";
import type { Course } from "../types/course";

export const getCourses = async (): Promise<Course[]> => {
    const res = await api.get("/api/courses");
    console.log(res);
    return res.data;
};

export const createCourse = async (courseData: any): Promise<Course> => {
    // We convert to FormData here because of the thumbnail file
    const formData = new FormData();
    
    Object.keys(courseData).forEach(key => {
        if (courseData[key] !== null && courseData[key] !== undefined) {
            formData.append(key, courseData[key]);
        }
    });

    const res = await api.post("/api/courses", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const getCourseById = async (id: string): Promise<Course> => {
    const res = await api.get(`/api/courses/${id}`);
    return res.data;
};