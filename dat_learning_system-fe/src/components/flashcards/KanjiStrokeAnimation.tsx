import { useEffect, useRef } from "react";
import HanziWriter from "hanzi-writer";

type Props = {
    kanji: string;
    width?: number;
    height?: number;
    delay?: number;
};

export default function KanjiStrokeAnimation({
    kanji,
    width = 150,
    height = 150,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.innerHTML = "";

        // ⚡ Use @ts-ignore to fully bypass TS issues
        // @ts-ignore
        const writer = HanziWriter.create(containerRef.current, kanji, {
            width,
            height,
            showOutline: true,
            showCharacter: true, // ✅ must be true for stroke numbers
            strokeAnimationSpeed: 2,
            delayBetweenStrokes: 200,
            strokeColor: "#FF0000",       // red strokes
            radicalColor: "#888888", // lightgray
            highlightColor: "#00FF00",
            strokeNumberColor: "#0000FF", // blue stroke numbers
        } as any);

        // ⚡ Animate with stroke numbers
        // @ts-ignore
        writer.animateCharacter({ showStrokeNumbers: true });

        return () => {
            // @ts-ignore
            writer.hideCharacter();
        };
    }, [kanji, width, height]);

    return <div ref={containerRef} style={{ width, height }} />;
}
