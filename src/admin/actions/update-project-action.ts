'use server';

import {DrizzleProject} from '@/services/drizzle/drizzle-project';
import {
    ProjectEntity,
    ProjectLocalesList,
    ProjectStringTypeList,
} from '@/types/project';
import {DrizzleProjectString} from '@/services/drizzle/drizzle-project-string';
import {auth} from '@/utils/auth/auth';

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
    const project = new DrizzleProject();
    const projectString = new DrizzleProjectString();

    try {
        await project.update(id, data);
    } catch (error) {
        return {
            data: prevState.data,
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
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
