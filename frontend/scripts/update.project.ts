import {Project} from '~interfaces/project';
import {RunParams} from '~interfaces/scripts';

import {getProjectsInfos} from '../src/utils/project';

import {saveProjectInfo} from './migrate.projects';

const mergeProject = (
    obj: Project,
    params: Record<string, string | boolean | number>,
): Project => {
    return Object.entries(params).reduce((prev, [key, value]) => {
        return {
            ...prev,
            ...(key in prev && {[key]: value}),
        };
    }, obj);
};

const toBoolean = (val: string | boolean) => {
    if (typeof val === 'boolean') {
        return val;
    }
    return !['no', 'false', '0'].includes(val);
};

const run = async ({
    slug,
    published,
    order: orderString,
    requireThemeCss,
    requireMyQuery,
    ...rest
}: RunParams) => {
    const projects = await getProjectsInfos();
    const project = projects.find((p) => p.slug === slug);
    if (!project) {
        console.error(`Unknown project: ${slug}`);
        return;
    }

    const params = Object.entries({
        published,
        requireThemeCss,
        requireMyQuery,
    }).reduce((prev, [key, val]) => {
        type Key = 'published' | 'requireThemeCss' | 'requireMyQuery';
        return {
            ...prev,
            [key]: val ? toBoolean(val) : project[key as Key],
        };
    }, {} as RunParams);

    const order = orderString ? Number(orderString) : project.order;
    await saveProjectInfo(
        project.slug,
        JSON.stringify(
            mergeProject(project, {
                ...params,
                order,
                ...rest,
            }),
            null,
            4,
        ),
    );
    console.log(`Project: ${slug} was updated`);
};

export default run;
