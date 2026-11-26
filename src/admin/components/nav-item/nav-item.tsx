'use client';

import React from 'react';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {LucideIcon} from 'lucide-react';

import {isNavItemActive, navItemClassName} from './nav-item-model';

type Props = {
    href: string;
    icon: LucideIcon;
    label: string;
    // Also active on these path prefixes (e.g. the edit pages of a list).
    activeOn?: string[];
    onClick?: () => void;
};

// A sidebar link with an icon.
export function NavItem({href, icon: Icon, label, activeOn = [], onClick}: Props) {
    const pathname = usePathname();
    const active = isNavItemActive(pathname, href, activeOn);

    return (
        <Link
            href={href}
            className={navItemClassName(active)}
            aria-current={active ? 'page' : undefined}
            onClick={onClick}
        >
            <Icon className="size-5 shrink-0" strokeWidth={1.8} aria-hidden />
            {label}
        </Link>
    );
}
