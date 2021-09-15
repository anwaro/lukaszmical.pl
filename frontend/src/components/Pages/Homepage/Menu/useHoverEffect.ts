import {useEffect, useRef, useState} from 'react';

export default function useHoverEffect(count: number, hoverTime = 1, breakTime = 4) {
    const [index, setIndex] = useState(-1);
    const [hover, setHover] = useState(false);
    const loopId = useRef(0);
    const animationIds = useRef<number[]>([]);

    const hoverAnimation = () => {
        animationIds.current = [];
        [...Array(count).fill(0)].map((_, i) => {
            animationIds.current.push(
                window.setTimeout(() => setIndex(i), i * hoverTime * 1000),
            );
        });
        animationIds.current.push(
            window.setTimeout(() => setIndex(-1), count * hoverTime * 1000),
        );
    };

    useEffect(() => {
        if (!hover) {
            loopId.current = window.setInterval(
                hoverAnimation,
                (count * hoverTime + breakTime) * 1000,
            );
        } else {
            setIndex(-1);
        }

        return () => {
            window.clearInterval(loopId.current);
            animationIds.current.map((id) => window.clearTimeout(id));
            animationIds.current = [];
        };
    }, [hover]);

    return {
        index,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
    };
}
