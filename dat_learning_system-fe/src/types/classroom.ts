import type { Test } from "./test";

export interface LessonContent {
    id: string;
    lessonId: string;
    contentType: 'text' | 'image' | 'video' | 'test';
    body: string;
    sortOrder: number;
    test?: Test;
}

export interface Lesson {
    id: string;
    courseId: string;
    title: string;
    time: string;
    sortOrder: number;
    isLocked: boolean;
    isDone: boolean;
    contents: LessonContent[];
}

export interface ClassroomView {
    courseId: string;
    courseTitle: string;
    lessons: Lesson[];
}

export interface CreateLessonRequest {
    courseId: string;
    title: string;
    sortOrder: number;
    time: string;
}

export interface ReOrderLessonsRequest {
    courseId: string;
    lessonIds: string[];
}

export type UpsertContentRequest = {
  contentType: string;
  body: string;
};

export type BulkSaveContentsRequest = {
  lessonId: string;
  contents: UpsertContentRequest[];
};

export interface UpdateLessonRequest {
    id: string;    // Matches the Guid on the backend
    title: string;
    time: string;  // Defaults to "-:--" or "5:00"
}