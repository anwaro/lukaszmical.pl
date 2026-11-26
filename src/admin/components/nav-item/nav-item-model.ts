import {clsx} from 'clsx';

// Whether a sidebar link counts as active for the current pathname: an exact
// match, or one of the extra prefixes (e.g. a list's own edit pages).
export function isNavItemActive(
    pathname: string,
    href: string,
    activeOn: string[],
): boolean {
    if (pathname === href) {
        return true;
    }
    return activeOn.some((prefix) => pathname.startsWith(prefix));
}

// Shared by `NavItem` (a link) and the sidebar's logout button (a <button>),
// which looks identical but is never "active".
export function navItemClassName(active: boolean, className?: string) {
    return clsx(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
        'text-slate-600 no-underline transition-colors hover:bg-slate-100',
        'focus-visible:outline-2 focus-visible:outline-blue-500',
        'focus-visible:outline-offset-2 dark:text-slate-400',
        'dark:hover:bg-slate-800',
        active && 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
        className,
    );
}
