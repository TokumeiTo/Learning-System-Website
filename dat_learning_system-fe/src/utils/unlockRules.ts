// src/utils/unlockRules.ts
import type { Lesson } from "../types/lesson";

export function applyUnlockRules(plates: Lesson[]): Lesson[] {
  let canUnlock = true;

  return plates.map((plate) => {
    const unlocked = canUnlock;

    if (!plate.completed) {
      canUnlock = false;
    }

    return {
      ...plate,
      locked: !unlocked,
    };
  });
}
