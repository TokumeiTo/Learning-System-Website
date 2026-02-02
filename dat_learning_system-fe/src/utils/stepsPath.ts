import type { Positionedsteps } from "./stepLayout";

export const generateSnakePath = (lessons: Positionedsteps[]) => {
  if (lessons.length === 0) return "";

  let d = `M${lessons[0].x + 40} ${lessons[0].y + 40}`;

  for (let i = 1; i < lessons.length; i++) {
    const prev = lessons[i - 1];
    const curr = lessons[i];

    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2 + 50;

    d += ` Q${midX} ${midY}, ${curr.x + 40} ${curr.y + 40}`;
  }

  return d;
};
