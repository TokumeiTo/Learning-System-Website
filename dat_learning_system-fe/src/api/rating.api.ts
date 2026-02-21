import api from "../hooks/useApi";
import type { RatingResponse, SubmitRatingDto } from "../types/rating";

export const submitCourseRating = async (
    courseId: string,
    data: SubmitRatingDto
): Promise<RatingResponse> => {
    const res = await api.post(`/api/CourseRating/${courseId}`, data);
    return res.data;
};