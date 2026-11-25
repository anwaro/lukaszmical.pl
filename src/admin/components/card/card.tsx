import React, {HTMLAttributes} from 'react';

import {clsx} from 'clsx';

type Props = HTMLAttributes<HTMLElement> & {
    as?: 'div' | 'section' | 'article';
    // lg: cards holding a form; none: a table or a list edge to edge.
    padding?: 'md' | 'lg' | 'none';
};

// A flat card: border, no shadow, radius-xl.
export function Card({as = 'div', padding = 'md', className, ...props}: Props) {
    return React.createElement(as, {
        ...props,
        className: clsx(
            'kv-card',
            padding === 'lg' && 'kv-card-lg',
            padding === 'none' && 'kv-card-flush',
            className,
        ),
    });
}

type TitleProps = {
    title: string;
    description?: string;
    children?: React.ReactNode;
};

// Title row of a card, with actions on the right.
export function CardHeader({title, description, children}: TitleProps) {
    return (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
                <h2 className="kv-card-title">{title}</h2>
                {description && <p className="kv-caption mt-1">{description}</p>}
            </div>
            {children}
        </div>
    );
}
