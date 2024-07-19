'use client';

import Link from 'next/link';
import {HoverElement} from '@/services/animation/type';
import {useRef} from 'react';

type Props = {
    link: string;
    onHoverChange: (isHover?: HoverElement) => void;
};

export function HomepageMenuItem({link, onHoverChange, children}: PWC<Props>) {
    const ref = useRef<HTMLAnchorElement | null>();

    const hoverElement = (): HoverElement => {
        const rect = ref.current?.getBoundingClientRect();

        return {
            x: rect?.x || 0,
            y: rect?.y || 0,
            width: rect?.width || 0,
            height: rect?.height || 0,
        };
    };

    return (
        <Link
            ref={ref}
            href={link}
            onMouseEnter={() => onHoverChange(hoverElement())}
            onMouseLeave={() => onHoverChange()}
            className={'inline-block text-white font-bold no-underline text-9xl'}
        >
            {children}
        </Link>
    );
}
