import {MouseEventHandler, useCallback, useRef, useState} from 'react';

export type Mouse = {
    x: number;
    y: number;
    active: boolean;
};

const initialState: Mouse = {
    x: 0,
    y: 0,
    active: false,
};

export function useMouse<Element extends HTMLElement>() {
    const ref = useRef<Element>(null!);
    const [mouse, setMouse] = useState<Mouse>(initialState);

    const onMouseMove: MouseEventHandler<Element> = useCallback(
        (e) => {
            setMouse((m) => ({...m, x: e.clientX, y: e.clientY}));
        },
        [setMouse],
    );

    return {
        mouse,
        ref,
        actions: {
            onMouseEnter: () => setMouse((m) => ({...m, active: true})),
            onMouseLeave: () => setMouse((m) => ({...m, active: false})),
            onMouseMove,
        },
    };
}
