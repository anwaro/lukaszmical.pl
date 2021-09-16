import {gql} from '@apollo/client';

import {BANNER_ENTITY} from '~graphql/entities/banner';
import {PROJECT_GROUP_ENTITY} from '~graphql/entities/projectGroup';
import {SEO_ENTITY} from '~graphql/entities/seo';

export const PAGE_QUERY = gql`
    query PageQuery($slug: String!) {
        pages(where: {slug: $slug}) {
            id
            title
            slug
            seo {
                ...SeoEntity
            }
            sections {
                ... on ComponentBlocksBanner {
                    ...BannerEntity
                }
                ... on ComponentBlocksGroup {
                    ...ProjectGroupEntity
                }
            }
        }
    }
    ${PROJECT_GROUP_ENTITY}
    ${BANNER_ENTITY}
    ${SEO_ENTITY}
`;
