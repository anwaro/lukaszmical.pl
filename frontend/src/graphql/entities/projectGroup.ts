import {gql} from '@apollo/client';

import {PROJECT_ENTITY} from '~graphql/entities/project';

export const PROJECT_GROUP_ENTITY = gql`
    fragment ProjectGroupEntity on ComponentBlocksGroup {
        id
        type
        title
        projects {
            ...ProjectEntity
        }
    }
    ${PROJECT_ENTITY}
`;
