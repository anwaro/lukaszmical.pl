import {notFound} from 'next/navigation';

import {ProjectRenderer} from '@/services/project-renderer';
import {params} from '@/app/api/projects/show/params';
import {LocalProjectService} from '@/services/LocalProjectService';
import {SupabaseProject} from '@/services/supabase/SupabaseProject';

export async function GET(request: Request) {
    const service = new LocalProjectService();
    const renderer = new ProjectRenderer();
    const client = new SupabaseProject();
    const url = new URL(request.url);
    const {slug, locale, minFile} = params(url);
    console.log({slug, locale, minFile});
    if (!slug) {
        notFound();
    }
    const project = await client.getLocalizedProjectBySlug(slug, locale);

    if (!project) {
        notFound();
    }
    const localProject = await service.toLocalProject(project, minFile);

    if (!localProject) {
        notFound();
    }

    const html = await renderer.render(localProject, minFile);

    if (!html) {
        notFound();
    }

    return new Response(html, {
        status: 200,
        headers: new Headers({
            'content-type': 'text/html',
        }),
    });
}
