export type ScheduleType = "lesson" | "quiz" | "practice";

export type ScheduleCategory = "vocabulary" | "grammar" | "reading" | "kanji";

export type ScheduleItem = {
  id: string;
  date: string; // YYYY-MM-DD
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  type: ScheduleType;
  category: ScheduleCategory;
  title: string;
  completed: boolean;
};
