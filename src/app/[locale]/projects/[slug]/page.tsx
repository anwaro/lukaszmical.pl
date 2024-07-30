import React from 'react';

import {notFound, redirect} from 'next/navigation';

import {ProjectRenderer} from '@/services/project-renderer';
import {ProjectIframe} from '@/ui/pages/project/iframe/project-iframe';
import {LocalProjectService} from '@/services/LocalProjectService';
import {SupabaseProject} from '@/services/supabase/SupabaseProject';
import {ProjectPage} from '@/ui/pages/project/page/project-page';
import {ProjectLocale} from '@/types/supabase/projects';

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
        return <ProjectPage project={project} />;
    }
    if (project.type === 'project') {
        const service = new LocalProjectService();
        const renderer = new ProjectRenderer();
        const localProject = await service.toLocalProject(project, true);

        if (!localProject) {
            notFound();
        }

        const html = await renderer.render(localProject, true);

        return <ProjectIframe html={html} />;
    }
    if (project.type === 'external') {
        redirect(project.url);
    }
}
