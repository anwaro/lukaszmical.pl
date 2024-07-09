'use client';

import React from 'react';
import {useBackgroundCanvas} from './index.hook';
import {HomepageMenu} from './menu';

export function PageHomepage() {
    const {ref, onMouseMove, setHover} = useBackgroundCanvas();

    return (
        <div className={'relative size-full'} onMouseMove={onMouseMove}>
            <canvas ref={ref} className={'absolute top-0 left-0 size-full'} />
            <HomepageMenu setHover={setHover} />
        </div>
    );
}
