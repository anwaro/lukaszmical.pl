import {SupabaseProject} from '@/services/supabase/supabase-project';

import {projects} from './projects';

export async function migrateProjects() {
    const client = new SupabaseProject();

    return client.createProjects(
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
}
