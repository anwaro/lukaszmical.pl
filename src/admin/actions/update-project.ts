'use server';

import {SupabaseProject} from '@/services/supabase/SupabaseProject';
import {
    ProjectEntity,
    ProjectLocalesList,
    ProjectStringTypeList,
} from '@/types/supabase/projects';
import {SupabaseProjectString} from '@/services/supabase/SupabaseProjectString';

export const updateProject = async (
    prevState: ProjectEntity,
    entity: ProjectEntity,
): Promise<ProjectEntity> => {
    const {id, description, name, content, ...data} = entity;
    const project = new SupabaseProject();
    const projectString = new SupabaseProjectString();

    await project.update(id, data);

    const strings = ProjectStringTypeList.flatMap((type) =>
        ProjectLocalesList.map((locale) => ({type, locale})),
    );

    for (let str of strings) {
        if (prevState[str.type][str.locale] !== entity[str.type][str.locale]) {
            console.log(
                str.type,
                str.locale,
                prevState[str.type][str.locale],
                entity[str.type][str.locale],
            );
            await projectString.updateValue(
                id,
                str.type,
                str.locale,
                entity[str.type][str.locale],
            );
        }
    }

    return entity;
};
