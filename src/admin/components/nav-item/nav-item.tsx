'use client';

import React from 'react';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {LucideIcon} from 'lucide-react';

type Props = {
    href: string;
    icon: LucideIcon;
    label: string;
    // Also active on these path prefixes (e.g. the edit pages of a list).
    activeOn?: string[];
    onClick?: () => void;
};

function isActive(pathname: string, href: string, activeOn: string[]) {
    if (pathname === href) {
        return true;
    }
    return activeOn.some((prefix) => pathname.startsWith(prefix));
}

// A sidebar link with an icon.
export function NavItem({href, icon: Icon, label, activeOn = [], onClick}: Props) {
    const pathname = usePathname();
    const active = isActive(pathname, href, activeOn);

    return (
        <Link
            href={href}
            className="kv-nav-item"
            aria-current={active ? 'page' : undefined}
            onClick={onClick}
        >
            <Icon className="kv-icon" strokeWidth={1.8} aria-hidden />
            {label}
        </Link>
    );
}
