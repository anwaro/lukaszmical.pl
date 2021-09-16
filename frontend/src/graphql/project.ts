import {gql} from '@apollo/client';

import {PROJECT_ENTITY} from '~graphql/entities/project';

export const PROJECT_QUERY = gql`
    query ProjectQuery($url: String!) {
        projects(where: {url: $url}) {
            ...ProjectEntity
        }
    }
    ${PROJECT_ENTITY}
`;
