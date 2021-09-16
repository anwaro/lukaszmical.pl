import {gql} from '@apollo/client';

import {FILE_ENTITY} from '~graphql/entities/file';

export const PROJECT_ENTITY = gql`
    fragment ProjectEntity on Projects {
        id
        name
        description
        type
        url
        createdAt
        cover {
            ...FileEntity
        }
    }
    ${FILE_ENTITY}
`;
