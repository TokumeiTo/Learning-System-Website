export interface StreakDatum {
  date: string; // YYYY-MM-DD (LOCAL)
  count: number;
}

/**
 * Format date using LOCAL time (timezone-safe)
 */
function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Generate all days of a year with default count 0
 */
export function generateYearStreak(year: number): StreakDatum[] {
  const data: StreakDatum[] = [];
  const d = new Date(year, 0, 1); // Jan 1 (local)

  while (d.getFullYear() === year) {
    data.push({
      date: formatLocalDate(d),
      count: 0,
    });
    d.setDate(d.getDate() + 1);
  }

  return data;
}

// 🔥 Manual mock streak data (API-ready)
const manualData: StreakDatum[] = [
  { date: "2025-01-01", count: 2 },
  { date: "2025-01-02", count: 5 },
  { date: "2025-01-03", count: 3 },
  { date: "2025-01-04", count: 0 },
  { date: "2025-01-05", count: 1 },
  { date: "2025-01-06", count: 4 },
  { date: "2025-01-07", count: 2 },
];

// ✅ Year MUST match the data
const year = 2025;
const yearData = generateYearStreak(year);

// ✅ Merge counts safely
manualData.forEach(d => {
  const target = yearData.find(day => day.date === d.date);
  if (target) {
    target.count = d.count;
  }
});

export default yearData;
