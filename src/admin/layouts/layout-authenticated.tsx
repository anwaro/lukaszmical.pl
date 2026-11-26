'use client';

import React, {ReactNode, useState} from 'react';

import Link from 'next/link';
import {ExternalLink, LogOut, Menu, X} from 'lucide-react';

import {IconButton} from '@/admin/components/button/icon-button';
import {NavItem} from '@/admin/components/nav-item/nav-item';
import {navItemClassName} from '@/admin/components/nav-item/nav-item-model';
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
        <div className="lg:pl-60">
            <aside
                className="fixed inset-y-0 left-0 z-40 flex w-60 -translate-x-full flex-col border-r border-slate-200 bg-white transition-transform duration-200 data-[open=true]:translate-x-0 lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900"
                data-open={isMenuOpen}
                aria-label="Nawigacja"
            >
                <div className="flex h-14 items-center gap-2.5 border-b border-slate-200 px-4 text-sm font-semibold text-slate-900 no-underline dark:border-slate-800 dark:text-white">
                    <Link
                        href="/admin"
                        className="flex items-center gap-2.5"
                        onClick={close}
                    >
                        <span
                            className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white"
                            aria-hidden
                        >
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
                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                    {adminMenu.map((item) => (
                        <NavItem key={item.href} {...item} onClick={close} />
                    ))}
                </nav>
                <form
                    action={logout}
                    className="border-t border-slate-200 p-3 dark:border-slate-800"
                >
                    <button
                        type="submit"
                        className={navItemClassName(false, 'w-full cursor-pointer')}
                    >
                        <LogOut className="size-5 shrink-0" strokeWidth={1.8} aria-hidden />
                        Wyloguj
                    </button>
                </form>
            </aside>
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-35 bg-slate-900/50 backdrop-blur-xs lg:hidden"
                    onClick={close}
                />
            )}

            <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-sm sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">
                <IconButton
                    icon={Menu}
                    label="Otwórz menu"
                    className="lg:hidden"
                    onClick={() => setIsMenuOpen(true)}
                />
                <span className="text-[11px]/4 font-medium tracking-wide text-slate-400 uppercase">
                    Panel administracyjny
                </span>
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
