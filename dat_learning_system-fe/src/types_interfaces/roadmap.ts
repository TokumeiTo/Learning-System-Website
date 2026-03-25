export interface RoadmapStep {
    id: number;
    title: string;
    nodeType: 'EBook' | 'Course' | 'Instruction';
    content?: string;
    linkedResourceId?: string;
    linkedResourceTitle?: string;
    linkedResourceDescription?: string;
    sortOrder: number;
}

export interface RoadmapResponse {
    id: number;
    title: string;
    description: string;
    targetRole?: string;
    stepCount: number;
    steps: RoadmapStep[];
}

export interface RoadmapRequest {
    title: string;
    description: string;
    targetRole?: string;
    linkedResourceId?: string | null;
}

export interface RoadmapGlobalSourceDto {
    value: string;       // e.g., "EBook - 1" or "Course - uuid"
    title: string;       // The Name of the book/course
    description: string; // Brief summary
    type: string;        // "EBook" or "Course"
}