import {SupabaseClient} from '@/services/supabase/supabase-client';
import {
    LocalizedProjectEntity,
    LocalizedProjectStringsEntity,
    ProjectEntity,
    ProjectInsert,
    ProjectListItem,
    ProjectLocale,
    ProjectRow,
    ProjectStringsListItem,
    ProjectStringTypeList,
} from '@/types/supabase/projects';
import {SupabaseProjectString} from '@/services/supabase/supabase-project-string';

export class SupabaseProject extends SupabaseClient {
    query() {
        return this.client.from('projects');
    }

    queryStrings() {
        return new SupabaseProjectString();
    }

    async getProject<T extends keyof ProjectRow>(
        column: T,
        value: NonNullable<ProjectRow[T]>,
    ): Promise<ProjectEntity | null> {
        const {data: project} = await this.query()
            .select('*')
            .eq(column, value)
            .single();

        if (project) {
            const projectStrings = await this.queryStrings().getProjectStrings(
                project.id,
            );

            return {
                ...project,
                ...projectStrings,
            };
        }

        return null;
    }

    async getLocalizedProjectBySlug(
        slug: string,
        locale: ProjectLocale,
    ): Promise<LocalizedProjectEntity | null> {
        const project = await this.getProject('url', slug);

        if (!project) {
            return null;
        }

        return {
            ...project,
            ...(Object.fromEntries(
                ProjectStringTypeList.map((field) => [
                    field,
                    project[field][locale],
                ]),
            ) as LocalizedProjectStringsEntity),
        };
    }

    async getProjectById(id: number | string) {
        return this.getProject('id', parseInt(`${id}`));
    }

    async update(id: number | string, data: Partial<ProjectRow>) {
        return this.query().update(data).eq('id', id);
    }

    async getProjects(): Promise<ProjectRow[]> {
        const query = this.query().select('*').order('order');

        const {data} = await query;
        return data ?? [];
    }

    async getProjectList(locale: ProjectLocale): Promise<ProjectListItem[]> {
        const {data} = await this.query()
            .select(
                `
                id, 
                url, 
                type,
                createdAt,
                cover,
                projects_strings(
                    type,
                    locale,
                    value
                )
            `,
            )
            .order('order')
            .eq('projects_strings.locale', locale)
            .in('projects_strings.type', ['name', 'description'])
            .eq('published', true);
        return (data ?? []).map(({projects_strings, ...project}) => ({
            ...project,
            ...(Object.fromEntries(
                projects_strings.map((str) => [str.type, str.value || '']),
            ) as ProjectStringsListItem),
        }));
    }

    async create(project: ProjectInsert) {
        return this.query().insert(project).select().single();
    }

    async createProjects(projects: ProjectInsert[]) {
        return this.query().insert(projects).select();
    }
}
