import type { stepPlate } from "../types_interfaces/stepPlate";

export function applyUnlockRules(plates: stepPlate[]): stepPlate[] {
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
