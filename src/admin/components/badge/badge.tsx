import React, {ReactNode} from 'react';

import {BadgeTone, badgeClassName, badgeDotClassName} from './badge-model';

export type {BadgeTone};

type Props = {
    tone?: BadgeTone;
    // A dot before the text; on by default for size md.
    dot?: boolean;
    // sm: a category label (11px, no dot).
    size?: 'md' | 'sm';
    className?: string;
    children: ReactNode;
};

// A status pill. Always with text — colour never carries the meaning alone.
export function Badge({
    tone = 'neutral',
    dot,
    size = 'md',
    className,
    children,
}: Props) {
    const showDot = dot ?? size === 'md';

    return (
        <span className={badgeClassName(tone, size, className)}>
            {showDot && <span className={badgeDotClassName(tone)} aria-hidden />}
            {children}
        </span>
    );
}
