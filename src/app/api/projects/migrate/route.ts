import {SupabaseProject} from '@/services/supabase/SupabaseProject';
import {projects} from './projects';

export async function GET() {
    const client = new SupabaseProject();

    const {data, error, count} = await client.createProjects(
        projects.map((project) => ({
            url: project.slug,
            name: project.name,
            description: project.description,
            createdAt: project.createdAt,
            themeCss: project.requireThemeCss,
            myQuery: project.requireMyQuery,
            type: 'project',
            content: '',
            order: 100,
            published: false,
        })),
    );

    return Response.json({data, error, count});
}
