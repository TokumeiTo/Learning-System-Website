export type ReferenceType = "Course" | "Enrollment" | "System";

export interface Announcement {
    id: string;
    title: string;
    content: string;
    targetPosition?: string; // We keep this as string because the API returns .ToString()
    createdAt: string;       
    displayUntil: string;    
    authorName: string;
}

export interface UpsertAnnouncementRequest {
    id?: string;             
    title: string;
    content: string;
    targetPositions: string[];
    displayUntil: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    referenceId?: string;
    referenceType?: ReferenceType;
    isRead: boolean;
    createdAt: string;
}