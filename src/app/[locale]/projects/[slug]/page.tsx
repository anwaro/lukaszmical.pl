import type {Metadata} from 'next';

import React from 'react';


import {notFound, redirect} from 'next/navigation';
import {serialize} from 'next-mdx-remote/serialize';

import {ProjectRenderer} from '@/services/project-renderer';
import {ProjectIframe} from '@/ui/pages/project/iframe/project-iframe';
import {LocalProjectService} from '@/services/local-project-service';
import {DrizzleProject} from '@/services/drizzle/drizzle-project';
import ProjectPage from '@/ui/pages/project/page/project-page';
import {ProjectLocale} from '@/types/project';
import {mdxSerializeOptions} from '@/ui/components/project/projet-mdx/project-mdx-options';
import {buildAlternates, localePath, siteName} from '@/utils/seo';

type Props = {
    params: Promise<{
        locale: ProjectLocale;
        slug: string;
    }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    const project = await new DrizzleProject().getLocalizedProjectBySlug(
        slug,
        locale,
    );

    if (!project) {
        return {};
    }

    const path = `/projects/${slug}`;
    const title = project.name ? `${project.name} | ${siteName}` : siteName;
    const description = project.description || undefined;

    return {
        title,
        description,
        alternates: buildAlternates(locale, path),
        openGraph: {
            type: 'article',
            title,
            description,
            url: localePath(locale, path),
            images: project.cover ? [project.cover] : undefined,
        },
    };
}

export default async function Page({params}: Props) {
    const {slug, locale} = await params;
    const client = new DrizzleProject();
    const project = await client.getLocalizedProjectBySlug(slug, locale);

    if (!project) {
        notFound();
    }

    if (project.type === 'page') {
        const source = await serialize(project.content, mdxSerializeOptions);
        return <ProjectPage project={project} source={source} />;
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

        return <ProjectIframe html={html} />;
    }

    redirect(project.url);
}
