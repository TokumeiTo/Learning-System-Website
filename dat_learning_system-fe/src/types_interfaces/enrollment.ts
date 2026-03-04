export interface EnrollmentRequest {
    id: string;
    studentName: string;
    studentEmail: string;
    courseId: string;
    courseTitle: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    requestedAt: string;
}

export interface SubmitEnrollment {
    courseId: string;
}

export interface EnrollmentStatusResponse {
    isEnrolled: boolean;
    status: 'Pending' | 'Approved' | 'Rejected' | 'None';
}