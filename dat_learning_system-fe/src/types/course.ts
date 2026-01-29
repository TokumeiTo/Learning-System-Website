import type { Topic } from "./topic";

export interface Course {
    id: string;
    category: string;
    title: string;
    isMandatory: boolean;
    thumbnail: string;
    description: string;
    certificationImage?: string;
    totalHours: number;
    rating: number;
    badge: string | number;
    enrolledCount: number;
    status: string | number;
    topics?: Topic[];
}