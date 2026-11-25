'use client';

import React, {ReactNode, useState} from 'react';

import Link from 'next/link';
import {ExternalLink, LogOut, Menu, X} from 'lucide-react';

import {IconButton} from '@/admin/components/button/icon-button';
import {NavItem} from '@/admin/components/nav-item/nav-item';
import {adminMenu} from '@/admin/menu';
import {ThemeToggle} from '@/admin/theme/theme-toggle';
import {logout} from '@/app/admin/auth/logout/actions';

type Props = {
    children: ReactNode;
};

// Sidebar (fixed from lg, a drawer below), sticky header, content.
export default function LayoutAuthenticated({children}: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const close = () => setIsMenuOpen(false);

    return (
        <div className="kv-shell">
            <aside
                className="kv-sidebar"
                data-open={isMenuOpen}
                aria-label="Nawigacja"
            >
                <div className="kv-sidebar-brand">
                    <Link
                        href="/admin"
                        className="flex items-center gap-2.5"
                        onClick={close}
                    >
                        <span className="kv-monogram" aria-hidden>
                            Ł
                        </span>
                        lukaszmical.pl
                    </Link>
                    <IconButton
                        icon={X}
                        label="Zamknij menu"
                        className="ml-auto lg:hidden"
                        onClick={close}
                    />
                </div>
                <nav className="kv-nav flex-1 overflow-y-auto p-3">
                    {adminMenu.map((item) => (
                        <NavItem key={item.href} {...item} onClick={close} />
                    ))}
                </nav>
                <form action={logout} className="border-t border-(--border) p-3">
                    <button
                        type="submit"
                        className="kv-nav-item w-full cursor-pointer"
                    >
                        <LogOut className="kv-icon" strokeWidth={1.8} aria-hidden />
                        Wyloguj
                    </button>
                </form>
            </aside>
            {isMenuOpen && <div className="kv-backdrop" onClick={close} />}

            <header className="kv-header">
                <IconButton
                    icon={Menu}
                    label="Otwórz menu"
                    className="lg:hidden"
                    onClick={() => setIsMenuOpen(true)}
                />
                <span className="kv-micro-label">Panel administracyjny</span>
                <div className="ml-auto flex items-center gap-1">
                    <IconButton
                        icon={ExternalLink}
                        label="Otwórz stronę"
                        href="/"
                        target="_blank"
                    />
                    <ThemeToggle />
                    <form action={logout}>
                        <IconButton icon={LogOut} label="Wyloguj" type="submit" />
                    </form>
                </div>
            </header>

            {children}
        </div>
    );
}
