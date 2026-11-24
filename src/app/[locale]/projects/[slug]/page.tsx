import type {Metadata} from 'next';

import React from 'react';

import {notFound, redirect} from 'next/navigation';

import {EntryRepository} from '@/services/content/repository-entry';
import {LocalProjectService} from '@/services/local-project-service';
import {ProjectRenderer} from '@/services/project-renderer';
import {Locale} from '@/types/locale';
import {JsonLd} from '@/ui/components/seo/json-ld';
import {ProjectIframe} from '@/ui/pages/project/iframe/project-iframe';
import {ProjectPage} from '@/ui/pages/project/project-page';
import {entryJsonLd, entryMetadata} from '@/utils/seo';

type Props = {
    params: Promise<{
        locale: Locale;
        slug: string;
    }>;
};

const getProject = (slug: string, locale: Locale) =>
    new EntryRepository().getLocalized('project', slug, locale);

// How many other projects the write-up page links to.
const OTHERS_LIMIT = 3;

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    const project = await getProject(slug, locale);

    return project ? entryMetadata(project, locale, `/projects/${slug}`) : {};
}

export default async function Page({params}: Props) {
    const {slug, locale} = await params;
    const project = await getProject(slug, locale);

    if (!project) {
        notFound();
    }

    if (project.presentation === 'link') {
        if (!project.linkUrl) {
            notFound();
        }
        redirect(project.linkUrl);
    }

    const jsonLd = entryJsonLd(project, locale, `/projects/${slug}`);

    if (project.presentation === 'article') {
        const others = (await new EntryRepository().list(locale, {kind: 'project'}))
            .filter((other) => other.id !== project.id)
            .slice(0, OTHERS_LIMIT);

        return (
            <>
                <JsonLd data={jsonLd} />
                <ProjectPage project={project} others={others} />
            </>
        );
    }

    const localProject = await new LocalProjectService().toLocalProject(project, true);

    if (!localProject) {
        console.log('localProject not found');
        notFound();
    }

    const html = await new ProjectRenderer().render(localProject, true);

    return (
        <>
            <JsonLd data={jsonLd} />
            <ProjectIframe html={html} />
        </>
    );
}
