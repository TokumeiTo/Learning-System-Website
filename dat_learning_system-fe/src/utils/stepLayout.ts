import type { stepPlate } from "../types/stepPlate";

export type Positionedsteps = stepPlate & {
    x: number;
    y: number;
};

export const generateZigZagLayout = (
    lessons: stepPlate[],
    options?: {
        startY?: number;
        verticalGap?: number;
        leftX?: number;
        rightX?: number;
        jitter?: number;
    }
): Positionedsteps[] => {
    const {
        startY = 40,
        verticalGap = 120,
        leftX = 80,
        rightX = 220,
        jitter = 8,
    } = options || {};

    return lessons.map((lesson, index) => {
        const isRight = index % 2 === 1;

        return {
            ...lesson,
            x:
                (isRight ? rightX : leftX) +
                (Math.random() * jitter * 2 - jitter),
            y:
                startY +
                index * verticalGap +
                (Math.random() * jitter * 2 - jitter),
        };
    });
};
