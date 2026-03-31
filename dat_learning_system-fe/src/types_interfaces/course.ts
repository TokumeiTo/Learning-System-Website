import type { Lesson } from "./classroom";
import type { ClassworkTopic } from "./classwork";

export interface Course {
  id: string; // Guid from .NET
  category: string;
  title: string;
  isMandatory: boolean;
  thumbnail: string;
  description: string;
  totalHours: number;
  rating: number;
  badge: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  enrolledCount: number;
  status: 'Published' | 'Draft' | 'Closed' | string;
  classworkTopics?: ClassworkTopic[];
  lessons?: Lesson[];
}

export interface CourseSummary {
  id: string;
  category: string;
  title: string;
  description: string;
  thumbnail: string;
  badge: string;
  status: string;
}

export interface CourseDetail extends CourseSummary {
  isMandatory: boolean;
  totalHours: number;
  rating: number;
  enrolledCount: number;
  classworkTopics?: ClassworkTopic[];
  lessons?: Lesson[];
}

// This helps React track the form before it's converted to FormData
export interface CreateCourseInputs extends Omit<Partial<Course>, 'thumbnail' | 'title' | 'description'> {
  title: string;          // Forced required for the form
  description: string;    // Forced required for the form
  badge: string;          // Forced required for the form
  thumbnailFile?: File | null;
}