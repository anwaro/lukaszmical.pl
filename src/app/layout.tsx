import type {Metadata, Viewport} from 'next';

import {Roboto} from 'next/font/google';
import {getLocale} from 'next-intl/server';
import {clsx} from 'clsx';

import {ogImage, siteName, siteUrl} from '@/utils/seo';

import './globals.css';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: `${siteName} | Personal webpage`,
        template: `%s`,
    },
    description:
        'Personal website and portfolio of Łukasz Micał — web developer, ' +
        'with interactive projects including nonogram and number-sums solvers.',
    applicationName: siteName,
    authors: [{name: siteName, url: siteUrl}],
    creator: siteName,
    icons: {
        icon: [
            {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
            {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
            {url: '/favicon.ico'},
        ],
        apple: '/apple-touch-icon.png',
    },
    openGraph: {
        type: 'website',
        siteName,
        url: '/',
        images: [ogImage],
    },
    twitter: {
        card: 'summary_large_image',
        images: [ogImage],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export const viewport: Viewport = {
    themeColor: '#000000',
};

const font = Roboto({
    weight: ['400', '700'],
    subsets: ['latin', 'latin-ext'],
});

export default async function RootLayout({children}: PWC) {
    const locale = await getLocale();

    return (
        <html
            lang={locale}
            className={clsx('dark-scrollbars-compat dark', font.className)}
        >
            <body>{children}</body>
        </html>
    );
}
