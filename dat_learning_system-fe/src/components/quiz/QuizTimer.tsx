import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
    initialSeconds: number;
    onTimeUp?: () => void;
};

export default function QuizTimer({ initialSeconds, onTimeUp }: Props) {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((s) => {
                if (s <= 1) {
                    clearInterval(timer);
                    onTimeUp?.();
                    return 0;
                }
                return s - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return <Typography>{`${mins}:${secs.toString().padStart(2, "0")}`}</Typography>;
}
