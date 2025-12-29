import type { CalendarEvent } from "../types/calendar";

export const calendarMock: CalendarEvent[] = [
  {
    id: "1",
    title: "N5 Vocabulary Study",
    date: "2025-01-26",
    source: "personal",
    editable: true,
  },
  {
    id: "2",
    title: "N5 Grammar Exam",
    date: "2025-01-28",
    source: "assigned",
    assignedBy: "manager01",
    targetUsers: ["userA", "userB", "userC"],
    editable: false,
  },
  {
    id: "3",
    title: "Company Training Day",
    date: "2025-01-30",
    source: "company",
    editable: false,
  },
];
