import {PROJECT_PAGE_QUERY} from '~graphql/project-page';

import {apolloClient} from './appoloClient';

export const fetchProjectsPage = async () => {
    return await apolloClient.query({query: PROJECT_PAGE_QUERY});
};
