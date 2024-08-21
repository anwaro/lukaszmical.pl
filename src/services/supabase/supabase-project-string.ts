import {SupabaseClient} from '@/services/supabase/supabase-client';
import {
    ProjectLocale,
    ProjectStringInsert,
    ProjectStringRow,
    ProjectStringsEntity,
    ProjectStringType,
} from '@/types/supabase/projects';

export class SupabaseProjectString extends SupabaseClient {
    query() {
        return this.client.from('projects_strings');
    }

    async getProjectStrings(id: number): Promise<ProjectStringsEntity> {
        const {data} = await this.query().select('*').eq('projectId', id);

        return (data || []).reduce(
            (acc, record) => {
                return {
                    ...acc,
                    [record.type]: {
                        ...(acc[record.type] || {}),
                        [record.locale]: record.value,
                    },
                };
            },
            {
                name: {
                    pl: '',
                    en: '',
                },
                description: {
                    pl: '',
                    en: '',
                },
                content: {
                    en: '',
                    pl: '',
                },
            } satisfies ProjectStringsEntity,
        );
    }

    async update(id: number | string, data: Partial<ProjectStringRow>) {
        await this.query().update(data).eq('id', id);
    }

    async updateValue(
        projectId: number | string,
        type: ProjectStringType,
        locale: ProjectLocale,
        value: string,
    ) {
        await this.query()
            .update({value})
            .eq('projectId', projectId)
            .eq('type', type)
            .eq('locale', locale);
    }

    async create(projectStrings: ProjectStringInsert) {
        return this.query().insert(projectStrings).select().single();
    }

    async createProjectStrings(projectStrings: ProjectStringInsert[]) {
        return this.query().insert(projectStrings).select();
    }
}
