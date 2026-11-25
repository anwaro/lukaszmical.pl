import React, {ReactNode} from 'react';

import {clsx} from 'clsx';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral';

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
        <span
            className={clsx(
                'kv-badge',
                `kv-badge-${tone}`,
                size === 'sm' && 'kv-badge-sm',
                className,
            )}
        >
            {showDot && <span className="kv-badge-dot" aria-hidden />}
            {children}
        </span>
    );
}
