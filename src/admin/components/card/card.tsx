import React, {HTMLAttributes} from 'react';

import {CardPadding, cardClassName} from './card-model';

type Props = HTMLAttributes<HTMLElement> & {
    as?: 'div' | 'section' | 'article';
    // lg: cards holding a form; none: a table or a list edge to edge.
    padding?: CardPadding;
};

// A flat card: border, no shadow, radius-xl.
export function Card({as = 'div', padding = 'md', className, ...props}: Props) {
    return React.createElement(as, {
        ...props,
        className: cardClassName(padding, className),
    });
}
