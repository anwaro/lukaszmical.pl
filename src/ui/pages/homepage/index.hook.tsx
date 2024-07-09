import {MouseEventHandler, useCallback, useEffect, useRef} from 'react';
import {CanvasAnimation} from '@/services/animation/CanvasAnimation';

export function useBackgroundCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    const animation = useRef<CanvasAnimation | null>(null);

    useEffect(() => {
        if (ref.current) {
            animation.current = new CanvasAnimation(ref.current);
        }

        return () => {
            animation.current?.destructor();
        };
    }, []);

    return {
        ref,
        setHover: (isHover: boolean) => {
            if (animation.current) {
                animation.current.isHover = isHover;
            }
        },
        onMouseMove: useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
            if (animation.current) {
                animation.current.mouseX = e.clientX;
                animation.current.mouseY = e.clientY;
            }
        }, []),
    };
}
