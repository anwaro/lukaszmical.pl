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
    const staticPaths = ['/', '/case-studies', '/projects'];

    let projectPaths: string[] = [];
    try {
        const client = new DrizzleProject();
        const [caseStudies, projects] = await Promise.all([
            client.getProjectList('pl', {caseStudies: true}),
            client.getProjectList('pl'),
        ]);
        projectPaths = [
            ...caseStudies.map((item) => `/case-studies/${item.url}`),
            ...projects
                .filter((project) => project.type !== 'external')
                .map((project) => `/projects/${project.url}`),
        ];
    } catch {
        // If the database is unreachable at build time, still emit the static
        // pages rather than failing the whole sitemap.
    }

    return [...staticPaths, ...projectPaths].map(entry);
}
