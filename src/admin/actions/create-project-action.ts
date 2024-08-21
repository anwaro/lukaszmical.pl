'use server';

import {SupabaseProject} from '@/services/supabase/supabase-project';
import {
    ProjectEntity,
    ProjectLocalesList,
    ProjectStringTypeList,
} from '@/types/supabase/projects';
import {SupabaseProjectString} from '@/services/supabase/supabase-project-string';
import {auth} from '@/utils/supabase/auth';
import {errorString} from '@/utils/supabase/error';

export type CreateProjectEntity = Omit<ProjectEntity, 'id'>;

type CreateProjectResult =
    | {status: undefined}
    | {status: 'error'; error: string}
    | {status: 'success'; id: number};

export const createProjectAction = async (
    _prevState: CreateProjectResult,
    entity: CreateProjectEntity,
): Promise<CreateProjectResult> => {
    await auth();
    const {description, name, content, ...data} = entity;
    const client = new SupabaseProject();
    const projectString = new SupabaseProjectString();

    const project = await client.create(data);

    if (!project.data) {
        return {
            status: 'error',
            error: errorString(project.error),
        };
    }

    const strings = ProjectStringTypeList.flatMap((type) =>
        ProjectLocalesList.map((locale) => ({
            projectId: project.data.id,
            type,
            locale,
            value: entity[type][locale],
        })),
    );

    await projectString.createProjectStrings(strings);

    return {
        status: 'success',
        id: project.data.id,
    };
};
