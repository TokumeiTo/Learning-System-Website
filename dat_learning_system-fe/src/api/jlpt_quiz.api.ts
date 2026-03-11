import api from "../hooks/useApi";
import type { 
    JlptTestDto, 
    QuizQuestionDto, 
    QuizSubmissionDto, 
    QuizResultDto,
    QuizSession 
} from "../types_interfaces/jlptquiz";

/**
 * STUDENT: Get available JLPT tests filtered by level and category
 */
export const fetchJlptTests = async (level: string, category: string): Promise<JlptTestDto[]> => {
    const res = await api.get<JlptTestDto[]>(`/api/JlptQuiz/list/${level}/${category}`);
    return res.data;
};

/**
 * STUDENT: Initialize a new quiz session and get the Session ID
 */
export const startJlptQuizSession = async (testId: string): Promise<number> => {
    const res = await api.post<number>(`/api/JlptQuiz/start/${testId}`);
    return res.data;
};

/**
 * STUDENT: Fetch question set for a specific test
 */
export const fetchJlptQuestions = async (testId: string): Promise<QuizQuestionDto[]> => {
    const res = await api.get<QuizQuestionDto[]>(`/api/JlptQuiz/questions/${testId}`);
    return res.data;
};

/**
 * STUDENT: Submit answers for grading
 */
export const submitJlptQuiz = async (submission: QuizSubmissionDto): Promise<QuizResultDto> => {
    const res = await api.post<QuizResultDto>("/api/JlptQuiz/submit", submission);
    return res.data;
};

/**
 * STUDENT: Fetch personal attempt history
 */
export const fetchJlptHistory = async (category?: string): Promise<QuizSession[]> => {
    const res = await api.get<QuizSession[]>("/api/JlptQuiz/history", {
        params: { category }
    });
    return res.data;
};

/**
 * ADMIN: Create a new JLPT Test Container
 */
export const createJlptTest = async (testData: Partial<JlptTestDto>): Promise<string> => {
    const res = await api.post<string>("/api/JlptQuiz/create-jlpt-test", testData);
    return res.data; // Returns the New Guid
};