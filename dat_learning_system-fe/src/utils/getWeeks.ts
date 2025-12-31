import type { StreakDatum } from "../mocks/dayStreak.mock";

/**
 * Parse YYYY-MM-DD as LOCAL date (timezone-safe)
 */
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function getWeeks(data: StreakDatum[], year: number) {
  const weeks: (StreakDatum | undefined)[][] = [];
  const months: { weekIndex: number; label: string }[] = [];

  let weekIndex = 0;
  let lastMonth = -1;

  data.forEach((d, i) => {
    const date = parseLocalDate(d.date);
    const day = date.getDay(); // 0 = Sun

    // Start a new week every Sunday (except first item)
    if (day === 0 && i !== 0) {
      weekIndex++;
    }

    if (!weeks[weekIndex]) {
      weeks[weekIndex] = [];
    }

    weeks[weekIndex][day] = d;

    // Add month label ONLY once per month
    const month = date.getMonth();
    if (date.getDate() === 1 && month !== lastMonth) {
      months.push({
        weekIndex,
        label: date.toLocaleString("en-US", { month: "short" }),
      });
      lastMonth = month;
    }
  });

  return { weeks, months };
}
