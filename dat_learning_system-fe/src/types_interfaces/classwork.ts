// types/classwork.ts

export interface ClassworkTopic {
  id: string;
  title: string;
  createdAt: string;
  items: ClassworkItem[];
}

export interface ClassworkItem {
  id: string;
  title: string;
  description?: string;
  itemType: 'Assignment' | 'Resource';
  dueDate?: string;
  maxPoints: number;
  resources: ClassworkResource[];
  mySubmission?: ClassworkSubmission; // Student specific
  createdAt: string;
  createdByName: string;
}

export interface ClassworkResource {
  id: string;
  resourceUrl: string;
  displayName: string;
  resourceType: 'File' | 'Link';
}

export interface ClassworkSubmission {
  id: string;
  fileUrl: string;
  fileName: string;
  submittedAt: string;
  updatedAt?: string;
  grade?: number;
  feedback?: string;
}

// --- Request Payloads (For API calls) ---

export interface CreateTopicPayload {
  title: string;
  courseId: string;
}

export interface CreateItemPayload {
  topicId: string;
  title: string;
  description?: string;
  itemType: string;
  dueDate?: string;
  maxPoints: number;
  resources: CreateResourcePayload[];
}

export interface CreateResourcePayload {
  body: string; // Base64 or Link
  displayName: string;
  resourceType: string;
}

export interface SubmitWorkPayload {
  classworkItemId: string;
  body: string; // Base64 string
  fileName: string;
}

export interface GradeSubmissionPayload {
  grade: number;
  feedback?: string;
}