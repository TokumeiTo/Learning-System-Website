import type { Position } from "./positions.ts";

export type ActivityType = 'LECTURE' | 'LAB' | 'EXAM' | 'MEETING' | 'HOLIDAY' | 'DEADLINE';

export interface SchedulePlan {
  id: string;
  title: string;
  description?: string;
  courseName?: string;
  instructorName?: string;
  activityType: ActivityType;
  startTime: string; // ISO String
  endTime?: string;   // ISO String
  location: string;
  color: string;
  isPublic: boolean;
  targetPositions: Position[];
  targetUserCodes: string[];
  createdBy: string;
  createdAt: string;
}

export interface SchedulePlanUpsert {
  title: string;
  description?: string;
  courseName?: string;
  instructorName?: string;
  activityType: ActivityType;
  startTime: string;
  endTime?: string;
  location: string;
  color: string;
  isPublic: boolean;
  targetPositions: Position[];
  targetUserCodes: string[];
}