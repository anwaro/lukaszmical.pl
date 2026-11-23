import type {Metadata} from 'next';

import React from 'react';


import {notFound, redirect} from 'next/navigation';

import {ProjectRenderer} from '@/services/project-renderer';
import {ProjectIframe} from '@/ui/pages/project/iframe/project-iframe';
import {LocalProjectService} from '@/services/local-project-service';
import {DrizzleProject} from '@/services/drizzle/drizzle-project';
import {ProjectPage} from '@/ui/pages/project/project-page';
import {ProjectLocale} from '@/types/project';
import {JsonLd} from '@/ui/components/seo/json-ld';
import {projectJsonLd, projectMetadata} from '@/utils/seo';

type Props = {
    params: Promise<{
        locale: ProjectLocale;
        slug: string;
    }>;
};

// Case studies share the table but live under /case-studies.
async function getProject(slug: string, locale: ProjectLocale) {
    const project = await new DrizzleProject().getLocalizedProjectBySlug(
        slug,
        locale,
    );
    return project && project.type !== 'case-study' ? project : null;
}

// How many other projects the write-up page links to.
const OTHERS_LIMIT = 3;

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    const project = await getProject(slug, locale);

    return project ? projectMetadata(project, locale, `/projects/${slug}`) : {};
}

export default async function Page({params}: Props) {
    const {slug, locale} = await params;
    const project = await getProject(slug, locale);

    if (!project) {
        notFound();
    }

    const jsonLd = projectJsonLd(project, locale, `/projects/${slug}`);

    if (project.type === 'page') {
        const others = (await new DrizzleProject().getProjectList(locale))
            .filter((other) => other.id !== project.id)
            .slice(0, OTHERS_LIMIT);

        return (
            <>
                <JsonLd data={jsonLd} />
                <ProjectPage project={project} others={others} />
            </>
        );
    }

    if (project.type === 'project') {
        const service = new LocalProjectService();
        const renderer = new ProjectRenderer();
        const localProject = await service.toLocalProject(project, true);

        if (!localProject) {
            console.log('localProject not found');
            notFound();
        }

        const html = await renderer.render(localProject, true);

        return (
            <>
                <JsonLd data={jsonLd} />
                <ProjectIframe html={html} />
            </>
        );
    }

    redirect(project.url);
}
