import api from '../hooks/useApi';
import type {
    EnrollmentRequest,
    SubmitEnrollment,
    EnrollmentStatusResponse
} from '../types/enrollment';

// Get current user's enrollment status for a specific course
export const getEnrollmentStatus = async (courseId: string): Promise<EnrollmentStatusResponse> => {
    const response = await api.get(`/api/enrollment/status/${courseId}`);
    return response.data;
};

// User requests to join a course
export const requestEnrollment = async (data: SubmitEnrollment): Promise<{ message: string }> => {
    const response = await api.post(`/api/enrollment/request`, data);
    return response.data;
};

// Admin: Get the queue of pending requests
export const getPendingRequests = async (): Promise<EnrollmentRequest[]> => {
    const response = await api.get(`/api/enrollment/pending`);
    return response.data;
};

// Admin: Approve or Reject a request with an optional reason
export const respondToEnrollment = async (
    id: string,
    approve: boolean,
    reason: string = "None" // Default to "None" if no reason is provided
): Promise<void> => {
    // We send 'approve' and 'reason' in the body for a cleaner API
    await api.patch(`/api/enrollment/respond/${id}`, {
        approve,
        reason
    });
};

export const getEnrollmentHistory = async (): Promise<EnrollmentRequest[]> => {
    const response = await api.get(`/api/enrollment/history`);
    return response.data;
};