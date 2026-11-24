import type {MetadataRoute} from 'next';

import {EntryRepository} from '@/services/content/repository-entry';
import {HOMEPAGE_SLUG} from '@/types/entry';
import {localeUrl} from '@/utils/seo';

import {locales} from '@/config';

function entry(path: string): MetadataRoute.Sitemap[number] {
    return {
        url: localeUrl('pl', path),
        alternates: {
            languages: Object.fromEntries(
                locales.map((locale) => [locale, localeUrl(locale, path)]),
            ),
        },
    };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPaths = ['/', '/case-studies', '/projects'];

    let projectPaths: string[] = [];
    try {
        const client = new EntryRepository();
        const [caseStudies, projects, pages] = await Promise.all([
            client.list('pl', {kind: 'case_study'}),
            client.list('pl', {kind: 'project'}),
            client.list('pl', {kind: 'page'}),
        ]);
        projectPaths = [
            ...pages
                .filter((page) => page.slug !== HOMEPAGE_SLUG)
                .map((page) => `/${page.slug}`),
            ...caseStudies.map((item) => `/case-studies/${item.slug}`),
            ...projects
                .filter((project) => project.presentation !== 'link')
                .map((project) => `/projects/${project.slug}`),
        ];
    } catch {
        // If the database is unreachable at build time, still emit the static
        // pages rather than failing the whole sitemap.
    }

    return [...staticPaths, ...projectPaths].map(entry);
}
