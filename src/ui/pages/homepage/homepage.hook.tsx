import {useEffect, useRef} from 'react';

import {Canvas} from '@/services/animation/canvas';
import {HoverElement} from '@/services/animation/type';

export function useBackgroundCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    const animation = useRef<Canvas | null>(null);

    useEffect(() => {
        if (ref.current) {
            animation.current = new Canvas(ref.current);
        }

        return () => {
            animation.current?.destructor();
        };
    }, []);

    return {
        ref,
        setHover: (hover?: HoverElement) => {
            if (animation.current) {
                animation.current.setHover(hover);
            }
        },
    };
}
