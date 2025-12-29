export type CalendarEventSource = "personal" | "assigned" | "company";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  source: CalendarEventSource;

  assignedBy?: string; // manager id
  targetUsers?: string[]; // A, B, C

  editable: boolean;
};
