import { useState, useEffect } from "react";

export default function Timer({ nbr, play }: { nbr: number, play: boolean }) {
    const [count, setCount] = useState<number>(nbr);
    const [timerId, setTimerID] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (play) {
            setCount(nbr);
            setTimerID(setInterval(() => setCount((prev) => prev - 1), 1000));
        } else {
            clearInterval(timerId!);
        }

        return () => {
            clearInterval(timerId!);
        };
    }, [play]);

    return <>{count}</>;
}