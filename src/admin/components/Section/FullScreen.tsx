'use client';

import React, {ReactNode} from 'react';

import {gradientBgDark} from '../../colors';

type Props = {
    children: ReactNode;
};

export default function SectionFullScreen({children}: Props) {
    return (
        <div
            className={`flex min-h-screen items-center justify-center ${gradientBgDark}`}
        >
            {children}
        </div>
    );
}
