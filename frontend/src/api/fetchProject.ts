import {PROJECT_QUERY} from '~graphql/project';
import {ProjectEntity} from '~types/ProjectEntity';

import {apolloClient} from './appoloClient';

export const fetchProject = async (url: string) => {
    const {data} = await apolloClient.query<{projects: ProjectEntity[]}>({
        query: PROJECT_QUERY,
        variables: {url},
    });

    if (data.projects.length) {
        return data.projects[0];
    }
    return undefined;
};
