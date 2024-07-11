'use client';

import React, {ReactNode} from 'react';
import {BgKey} from '../../interfaces';
import {gradientBgDark, gradientBgPinkRed, gradientBgPurplePink} from '../../colors';
import {useDarkMode} from '@/admin/stores/dark-mode';

type Props = {
    bg: BgKey;
    children: ReactNode;
};

export default function SectionFullScreen({bg, children}: Props) {
    const {darkModeEnabled} = useDarkMode();

    let componentClass = 'flex min-h-screen items-center justify-center ';

    if (darkModeEnabled) {
        componentClass += gradientBgDark;
    } else if (bg === 'purplePink') {
        componentClass += gradientBgPurplePink;
    } else if (bg === 'pinkRed') {
        componentClass += gradientBgPinkRed;
    }

    return <div className={componentClass}>{children}</div>;
}
