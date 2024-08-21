import React from 'react';

import {ColorKey} from '../../interfaces';
import {colorsBgLight, colorsText} from '../../colors';
import {Icon} from './icon';

type Props = {
    icon: string;
    color: ColorKey;
    w?: string;
    h?: string;
    bg?: boolean;
    className?: string;
};

export function IconRounded({
    icon,
    color,
    w = 'w-12',
    h = 'h-12',
    bg = false,
    className = '',
}: Props) {
    const classAddon = bg
        ? colorsBgLight[color]
        : `${colorsText[color]} bg-slate-800`;

    return (
        <Icon
            path={icon}
            w={w}
            h={h}
            size="24"
            className={`rounded-full ${classAddon} ${className}`}
        />
    );
}
