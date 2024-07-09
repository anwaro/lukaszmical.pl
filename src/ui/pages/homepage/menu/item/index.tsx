'use client';

import Link from 'next/link';

type Props = {
    link: string;
    onHoverChange: (isHover: boolean) => void;
};

export function HomepageMenuItem({link, onHoverChange, children}: PWC<Props>) {
    return (
        <Link
            href={link}
            onMouseEnter={() => onHoverChange(true)}
            onMouseLeave={() => onHoverChange(false)}
            className={'inline-block font-bold no-underline text-9xl'}
        >
            {children}
        </Link>
    );
}
