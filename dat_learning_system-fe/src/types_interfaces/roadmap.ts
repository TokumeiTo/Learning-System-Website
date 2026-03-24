export interface RoadmapStep {
    id: number;
    title: string;
    nodeType: 'EBook' | 'Course' | 'Instruction';
    content?: string;
    linkedResourceId?: number;
    sortOrder: number;
}

export interface RoadmapResponse {
    id: number;
    title: string;
    description: string;
    targetRole?: string;
    thumbnailUrl?: string;
    stepCount: number;
    steps: RoadmapStep[];
}

export interface RoadmapRequest {
    title: string;
    description: string;
    targetRole?: string;
    // Note: If you add thumbnail upload later, this might become FormData
}