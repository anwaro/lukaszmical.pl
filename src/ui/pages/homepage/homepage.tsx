'use client';

import React, {MouseEventHandler, useCallback, useState} from 'react';
import {HomepageUserCursor} from './user-cursor';

export function PageHomepage() {
    // const {ref, setHover} = useBackgroundCanvas();
    const [mouse, setMouse] = useState<[number, number]>([0, 0]);

    const onMouseMove = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
        setMouse([e.clientX / window.innerWidth, e.clientY / window.innerHeight]);
    }, []);

    return (
        <div className={'relative w-full h-[100vh]'} onMouseMove={onMouseMove}>
            {/*<canvas ref={ref} className={'absolute top-0 left-0 size-full'} />*/}
            <HomepageUserCursor mouse={mouse} />
            {/*<HomepageMenu setHover={setHover} />*/}
        </div>
    );
}
