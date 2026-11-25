import {Geist, Geist_Mono} from 'next/font/google';
import {cookies} from 'next/headers';
import {clsx} from 'clsx';

import '@/admin/css/main.css';
import {ADMIN_THEME_COOKIE, parseAdminTheme} from '@/admin/theme/admin-theme';
import {ThemeProvider} from '@/admin/theme/theme-provider';

const geist = Geist({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    variable: '--font-geist',
});

const geistMono = Geist_Mono({
    weight: ['400', '500'],
    subsets: ['latin', 'latin-ext'],
    variable: '--font-geist-mono',
});

export default async function Layout({children}: PWC) {
    const theme = parseAdminTheme((await cookies()).get(ADMIN_THEME_COOKIE)?.value);

    return (
        <ThemeProvider
            initialTheme={theme}
            className={clsx(geist.variable, geistMono.variable)}
        >
            {children}
        </ThemeProvider>
    );
}
