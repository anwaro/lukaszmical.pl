'use server';

import {DrizzleProject} from '@/services/drizzle/drizzle-project';
import {
    ProjectEntity,
    ProjectLocalesList,
    ProjectStringTypeList,
} from '@/types/project';
import {DrizzleProjectString} from '@/services/drizzle/drizzle-project-string';
import {auth} from '@/utils/auth/auth';

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
    const client = new DrizzleProject();
    const projectString = new DrizzleProjectString();

    try {
        const project = await client.create(data);

        const strings = ProjectStringTypeList.flatMap((type) =>
            ProjectLocalesList.map((locale) => ({
                projectId: project.id,
                type,
                locale,
                value: entity[type][locale],
            })),
        );

        await projectString.createProjectStrings(strings);

        return {
            status: 'success',
            id: project.id,
        };
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
        };
    }
};
