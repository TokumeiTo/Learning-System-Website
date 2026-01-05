import { useEffect, useMemo, useRef } from "react";
import { Box, Stack, Typography, Tooltip as MuiTooltip } from "@mui/material";
import data from "../../mocks/dayStreak.mock";
import { getWeeks } from "../../utils/getWeeks";
import { formatLocalDate } from "../../utils/dateUtils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const COLORS = [
  "#e0f2ff", // very light blue (low count)
  "#90c6f5ff", // light blue
  "#53abfdff", // medium blue
  "#0084ffff", // dark blue
  "#0045adff", // very dark blue (high count)
];
const CELL = 30;
const GAP = 1;
const YEAR = new Date().getFullYear();
const today = formatLocalDate(new Date());

export default function CalendarHeatmap() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayStr = new Date().toISOString().slice(0, 10);

  const { weeks, months, maxCount } = useMemo(() => {
    const { weeks, months } = getWeeks(data, YEAR);
    const max = Math.max(...data.map(d => d.count), 1);
    return { weeks, months, maxCount: max };
  }, []);

  // Auto-center today
  useEffect(() => {
    if (!scrollRef.current) return;
    const todayWeek = weeks.findIndex(w => w.some(d => d?.date === todayStr));
    if (todayWeek >= 0) {
      const colWidth = CELL + GAP;
      scrollRef.current.scrollLeft =
        todayWeek * colWidth - scrollRef.current.clientWidth / 2 + colWidth / 2;
    }
  }, [weeks, todayStr]);

  return (
    <Stack spacing={1} sx={{ width: "100%", overflow: "hidden" }}>
      <Typography align="center" fontWeight="bold" sx={{userSelect: 'none'}}>
        Daily Streak
      </Typography>

      {/* ONE SCROLL AREA */}
      <Box
        ref={scrollRef}
        sx={{
          overflowX: "auto",
          display: "flex",
          gap: GAP,
          pb: 5,
          /* Hide scrollbar by default for Webkit */
          "&::-webkit-scrollbar": {
            height: 10,
            opacity: 0,
            transition: "opacity 0.3s",
          },
          "&:hover::-webkit-scrollbar": {
            opacity: 1,
          },
          "&::-webkit-scrollbar-thumb": {
            background: '#008cffff',
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-track": {
            background: "#ebebebff",
            borderRadius: 3,
          },
        }}
      >
        {/* LEFT DAY LABELS */}
        <Stack spacing={GAP} sx={{ flexShrink: 0 }}>
          <Box height={CELL} /> {/* spacer for months */}
          {DAYS.map(d => (
            <Typography
              key={d}
              variant="caption"
              sx={{ height: CELL, lineHeight: `${CELL}px`, userSelect: 'none' }}
            >
              {d}
            </Typography>
          ))}
        </Stack>

        {/* WEEKS */}
        {weeks.map((week, wi) => {
          const month = months.find(m => m.weekIndex === wi);

          return (
            <Stack key={wi} spacing={GAP} alignItems="center">
              {/* MONTH */}
              <Box height={CELL}>
                {month && (
                  <Typography variant="caption" sx={{userSelect: 'none'}}>{month.label}</Typography>
                )}
              </Box>

              {/* DAYS */}
              {DAYS.map((_, di) => {
                const cell = week[di];
                const level = cell
                  ? Math.floor((cell.count / maxCount) * (COLORS.length - 1))
                  : 0;

                const isToday = cell?.date === today; // highlight today

                return (
                  <MuiTooltip
                    key={di}
                    title={cell ? `${cell.count} on ${cell.date}` : ""}
                  >
                    <Box
                      sx={{
                        width: CELL,
                        height: CELL,
                        bgcolor: COLORS[level],
                        borderRadius: 5,
                        border: isToday ? "2px solid #ff9800" : "1px solid transparent",
                        boxSizing: "border-box",
                      }}
                    />
                  </MuiTooltip>
                );
              })}

            </Stack>
          );
        })}
      </Box>
    </Stack>
  );
}
