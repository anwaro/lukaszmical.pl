import {gql} from '@apollo/client';

export const SEO_ENTITY = gql`
    fragment SeoEntity on ComponentBlocksSeo {
        id
        pageTitle
        pageDescription
        image {
            url
        }
    }
`;
