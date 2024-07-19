'use client';

import {HomepageMenuItem} from './item';
import {useTranslations} from 'next-intl';
import {useMemo} from 'react';
import {HoverElement} from '@/services/animation/type';

type Props = {
    setHover: (isHover?: HoverElement) => void;
};

export function HomepageMenu({setHover}: Props) {
    const t = useTranslations('homepage');

    const items = useMemo(
        () => [
            {link: '/about', label: t('about')},
            {link: '/projects', label: t('work')},
            {link: '/contact', label: t('contact')},
        ],
        [t],
    );

    return (
        <ul className={'flex flex-col justify-center h-full relative z-10 px-8'}>
            {items.map((item) => (
                <li key={item.link}>
                    <HomepageMenuItem link={item.link} onHoverChange={setHover}>
                        {item.label}
                    </HomepageMenuItem>
                </li>
            ))}
        </ul>
    );
}
