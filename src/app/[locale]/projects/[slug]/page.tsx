import React from 'react';

import {notFound, redirect} from 'next/navigation';
import {serialize} from 'next-mdx-remote/serialize';

import {ProjectRenderer} from '@/services/project-renderer';
import {ProjectIframe} from '@/ui/pages/project/iframe/project-iframe';
import {LocalProjectService} from '@/services/local-project-service';
import {SupabaseProject} from '@/services/supabase/supabase-project';
import ProjectPage from '@/ui/pages/project/page/project-page';
import {ProjectLocale} from '@/types/supabase/projects';
import {mdxSerializeOptions} from '@/ui/components/project/projet-mdx/project-mdx-options';

type Props = {
    params: {
        locale: ProjectLocale;
        slug: string;
    };
};

export default async function Page({params}: Props) {
    const client = new SupabaseProject();
    const project = await client.getLocalizedProjectBySlug(
        params.slug,
        params.locale,
    );

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
