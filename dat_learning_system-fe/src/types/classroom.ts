export interface LessonContent {
    id: string;
    lessonId: string;
    contentType: 'text' | 'image' | 'video';
    body: string;
    sortOrder: number;
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

