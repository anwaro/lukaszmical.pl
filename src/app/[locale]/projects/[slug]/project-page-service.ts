import type {Metadata} from 'next';

import {cache} from 'react';

import {notFound, redirect} from 'next/navigation';

import {EntryRepository} from '@/services/content/repository-entry';
import {resolveEntryVisibility} from '@/services/content/entry-visibility';
import {LocalProjectService} from '@/services/local-project-service';
import {ProjectRenderer} from '@/services/project-renderer';
import {LocalizedEntry, EntryListItem} from '@/types/entry';
import {Locale} from '@/types/locale';
import {draftMetadata, entryJsonLd, entryMetadata} from '@/utils/seo';

// Cached per request: generateMetadata and the page both need it.
const getProject = cache((slug: string, locale: Locale) =>
    new EntryRepository().getLocalized('project', slug, locale),
);

// How many other projects the write-up page links to.
const OTHERS_LIMIT = 3;

export type ProjectPageResolution = {
    editHref?: string;
    jsonLd: ReturnType<typeof entryJsonLd>;
} & (
    | {presentation: 'article'; project: LocalizedEntry; others: EntryListItem[]}
    | {presentation: 'iframe'; html: string}
);

export class ProjectPageService {
    async getMetadata(slug: string, locale: Locale): Promise<Metadata> {
        const project = await getProject(slug, locale);
        if (!project) {
            return {};
        }
        return project.published
            ? entryMetadata(project, locale, `/projects/${slug}`)
            : draftMetadata;
    }

    // Resolves a project to what the page should render. Calls `notFound()`
    // or `redirect()` itself (never returning) for the cases that aren't a
    // page to render.
    async resolve(slug: string, locale: Locale): Promise<ProjectPageResolution> {
        const visible = await resolveEntryVisibility(await getProject(slug, locale));

        if (!visible) {
            notFound();
        }

        const {entry: project, editHref} = visible;

        if (project.presentation === 'link') {
            if (!project.linkUrl) {
                notFound();
            }
            redirect(project.linkUrl);
        }

        const jsonLd = entryJsonLd(project, locale, `/projects/${slug}`);

        if (project.presentation === 'article') {
            const others = (
                await new EntryRepository().list(locale, {kind: 'project'})
            )
                .filter((other) => other.id !== project.id)
                .slice(0, OTHERS_LIMIT);

            return {presentation: 'article', project, others, editHref, jsonLd};
        }

        const localProject = await new LocalProjectService().toLocalProject(
            project,
            true,
        );

        if (!localProject) {
            console.log('localProject not found');
            notFound();
        }

        const html = await new ProjectRenderer().render(localProject, true);

        return {presentation: 'iframe', html, editHref, jsonLd};
    }
}
