import {SupabaseClient} from '@/services/supabase/SupabaseClient';
import {ProjectInsert, ProjectRow} from '@/types/supabase/projects';

export class SupabaseProject extends SupabaseClient {
    async getProjectBySlug(slug: string): Promise<ProjectRow | null> {
        const {data} = await this.client
            .from('projects')
            .select('*')
            .eq('slug', slug);
        return data?.length ? (data[0] as ProjectRow) : null;
    }

    async getProject(id: number | string): Promise<ProjectRow | null> {
        const {data} = await this.client.from('projects').select('*').eq('id', id);
        return data?.length ? (data[0] as ProjectRow) : null;
    }

    async update(id: number | string, data: Partial<ProjectRow>) {
        await this.client.from('projects').update(data).eq('id', id);
    }

    async getProjects(onlyPublished = true): Promise<ProjectRow[]> {
        const query = this.client.from('projects').select('*').order('order');
        if (onlyPublished) {
            query.eq('published', true);
        }

        const {data} = await query;
        return data ?? [];
    }

    async createProjects(projects: ProjectInsert[]) {
        return this.client.from('projects').insert(projects).select();
    }
}
