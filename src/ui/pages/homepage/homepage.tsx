'use client';

import React from 'react';

import Image from 'next/image';
import {useTranslations} from 'next-intl';

import {HomepageMenu} from './menu';
import {useBackgroundCanvas} from './homepage.hook';

export function PageHomepage() {
    const {ref, setHover} = useBackgroundCanvas();
    const t = useTranslations('homepage');
    // const [mouse, setMouse] = useState<[number, number]>([0, 0]);

    // const onMouseMove = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    //     setMouse([e.clientX / window.innerWidth, e.clientY / window.innerHeight]);
    // }, []);

    return (
        <div className={'relative h-screen w-full'} /*onMouseMove={onMouseMove}*/>
            <Image
                src={'/logo.svg'}
                alt={t('alt.logo')}
                width={80}
                height={100}
                className="absolute left-2/4 top-6 z-10 -translate-x-2/4"
            />
            <canvas ref={ref} className={'absolute left-0 top-0 size-full'} />
            {/*<HomepageUserCursor mouse={mouse} />*/}
            <HomepageMenu setHover={setHover} />
        </div>
    );
}
