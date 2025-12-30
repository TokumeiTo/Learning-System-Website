import type { Lesson } from "../types/lesson";

export type PositionedLesson = Lesson & {
    x: number;
    y: number;
};

export const generateZigZagLayout = (
    lessons: Lesson[],
    options?: {
        startY?: number;
        verticalGap?: number;
        leftX?: number;
        rightX?: number;
        jitter?: number;
    }
): PositionedLesson[] => {
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
