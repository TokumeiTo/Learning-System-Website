import api from "../hooks/useApi";
import type { QuizQuestionDto, QuizAnswerDto, JlptTestDto, QuizSession, QuizSubmissionDto } from "../types_interfaces/jlptquiz";

// STUDENT ENDPOINTS
export const fetchJlptTests = async (level: string, category: string): Promise<JlptTestDto[]> => {
    const res = await api.get(`/api/JlptQuiz/tests?level=${level}&category=${category}`);
    return res.data;
};

export const fetchJlptQuestions = async (testId: string): Promise<QuizQuestionDto[]> => {
    const res = await api.get(`/api/JlptQuiz/questions/${testId}`);
    return res.data;
};

export const submitJlptQuiz = async (data: QuizSubmissionDto) => {
    const res = await api.post(`/api/JlptQuiz/submit`, data);
    return res.data;
};

export const fetchJlptHistory = async (category: string): Promise<QuizSession[]> => {
    const res = await api.get(`/api/JlptQuiz/history?category=${category}`);
    return res.data;
};

// ADMIN ENDPOINTS
export const createJlptTest = async (data: Partial<JlptTestDto>) => {
    return await api.post(`/api/JlptQuiz/admin/create-test`, data);
};

export const linkContentToTest = async (testId: string, data: any) => {
    return await api.post(`/api/JlptQuiz/admin/link-content/${testId}`, data);
};

export const startQuizSession = async (testId: string): Promise<number> => {
    const res = await api.post(`/api/JlptQuiz/start/${testId}`);
    return res.data; // Expecting an integer
};