import type {Metadata} from 'next';

import {getTranslations} from 'next-intl/server';

import {ProjectLocale} from '@/types/project';

import {defaultLocale, locales} from '@/config';

export const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lukaszmical.pl'
).replace(/\/$/, '');

export const siteName = 'Łukasz Micał';

// Build a locale-prefixed path following the `as-needed` strategy: the default
// locale has no prefix, the others are prefixed with `/<locale>`.
export function localePath(locale: ProjectLocale, path = ''): string {
    const clean = path === '/' ? '' : path.replace(/\/$/, '');
    const prefix = locale === defaultLocale ? '' : `/${locale}`;
    return `${prefix}${clean}` || '/';
}

export function localeUrl(locale: ProjectLocale, path = ''): string {
    return `${siteUrl}${localePath(locale, path)}`;
}

// Canonical (for the current locale) plus hreflang alternates for every locale.
// Paths are relative — Next resolves them against `metadataBase`.
export function buildAlternates(
    locale: ProjectLocale,
    path = '',
): Metadata['alternates'] {
    return {
        canonical: localePath(locale, path),
        languages: {
            ...Object.fromEntries(
                locales.map((item) => [item, localePath(item, path)]),
            ),
            'x-default': localePath(defaultLocale, path),
        },
    };
}

// Metadata for a static localized page whose namespace exposes `title` and
// `description` message keys.
export async function metadataForPage(
    locale: ProjectLocale,
    namespace: string,
    path: string,
): Promise<Metadata> {
    const t = await getTranslations({locale, namespace});
    const title = t('title');
    const description = t('description');

    return {
        title,
        description,
        alternates: buildAlternates(locale, path),
        openGraph: {title, description, url: localePath(locale, path)},
    };
}
