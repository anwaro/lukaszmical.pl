'use client';

import React, {
    createContext,
    useContext,
    useState,
    useSyncExternalStore,
} from 'react';

import {clsx} from 'clsx';

import {ADMIN_THEME_COOKIE, AdminTheme} from './admin-theme';

type ThemeContextValue = {
    // The theme on screen: the choice, else the system preference.
    theme: AdminTheme;
    toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'light',
    toggle: () => undefined,
});

const darkQuery = '(prefers-color-scheme: dark)';

function subscribe(onChange: () => void) {
    const query = window.matchMedia(darkQuery);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
}

function useSystemTheme(): AdminTheme {
    return useSyncExternalStore(
        subscribe,
        () => (window.matchMedia(darkQuery).matches ? 'dark' : 'light'),
        () => 'light',
    );
}

type Props = PWC<{
    // From the cookie, so the first paint has the chosen theme.
    initialTheme?: AdminTheme;
    className?: string;
}>;

// The root of the admin: holds the theme and the Kivo tokens. Without a chosen
// theme `data-theme` is left out and the CSS follows the system preference.
export function ThemeProvider({initialTheme, className, children}: Props) {
    const [chosen, setChosen] = useState(initialTheme);
    const system = useSystemTheme();
    const theme = chosen ?? system;

    const toggle = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        document.cookie = `${ADMIN_THEME_COOKIE}=${next}; path=/admin; max-age=31536000; samesite=lax`;
        setChosen(next);
    };

    return (
        <ThemeContext.Provider value={{theme, toggle}}>
            <div
                className={clsx(
                    'admin-root min-h-screen bg-slate-50 text-sm/5 text-slate-900',
                    'antialiased dark:bg-slate-950 dark:text-white',
                    'font-(family-name:--font-geist)',
                    className,
                )}
                data-theme={chosen}
            >
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useAdminTheme() {
    return useContext(ThemeContext);
}
