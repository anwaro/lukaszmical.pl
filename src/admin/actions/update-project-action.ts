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

type UpdateProjectResult =
    | {data: ProjectEntity; status: undefined}
    | {data: ProjectEntity; status: 'error'; error: string}
    | {data: ProjectEntity; status: 'success'};

export const updateProjectAction = async (
    prevState: UpdateProjectResult,
    entity: ProjectEntity,
): Promise<UpdateProjectResult> => {
    await auth();
    const {id, description, name, content, ...data} = entity;
    const project = new SupabaseProject();
    const projectString = new SupabaseProjectString();

    const action = await project.update(id, data);

    if (action.error) {
        return {
            data: prevState.data,
            status: 'error',
            error: errorString(action.error),
        };
    }

    const strings = ProjectStringTypeList.flatMap((type) =>
        ProjectLocalesList.map((locale) => ({type, locale})),
    );

    for (let str of strings) {
        if (prevState.data[str.type][str.locale] !== entity[str.type][str.locale]) {
            await projectString.updateValue(
                id,
                str.type,
                str.locale,
                entity[str.type][str.locale],
            );
        }
    }

    return {
        data: entity,
        status: 'success',
    };
};
