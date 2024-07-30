'use client';

import {useRef} from 'react';

import Link from 'next/link';

import {HoverElement} from '@/services/animation/type';

type Props = {
    link: string;
    onHoverChange: (isHover?: HoverElement) => void;
};

export function HomepageMenuItem({link, onHoverChange, children}: PWC<Props>) {
    const ref = useRef<HTMLAnchorElement | null>(null);

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
            className={'inline-block text-9xl font-bold text-white no-underline'}
        >
            {children}
        </Link>
    );
}
