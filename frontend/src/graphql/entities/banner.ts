import {gql} from '@apollo/client';

import {FILE_ENTITY} from '~graphql/entities/file';

export const BANNER_ENTITY = gql`
    fragment BannerEntity on ComponentBlocksBanner {
        id
        text
        urlType: type
        url
        image {
            ...FileEntity
        }
        mobileImage {
            ...FileEntity
        }
    }
    ${FILE_ENTITY}
`;
