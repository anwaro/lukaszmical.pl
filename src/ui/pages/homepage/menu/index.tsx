'use client';

import {useMemo} from 'react';

import {useTranslations} from 'next-intl';

import {HoverElement} from '@/services/animation/type';

import {HomepageMenuItem} from './item';

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
        <ul className={'relative z-10 flex h-full flex-col justify-center px-8'}>
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
