import type {MetadataRoute} from 'next';

import {DrizzleProject} from '@/services/drizzle/drizzle-project';
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
    const staticPaths = ['/', '/about', '/contact', '/projects'];

    let projectPaths: string[] = [];
    try {
        const projects = await new DrizzleProject().getProjectList('pl');
        projectPaths = projects.map((project) => `/projects/${project.url}`);
    } catch {
        // If the database is unreachable at build time, still emit the static
        // pages rather than failing the whole sitemap.
    }

    return [...staticPaths, ...projectPaths].map(entry);
}
