import {gql} from '@apollo/client';

export const FILE_ENTITY = gql`
    fragment FileEntity on UploadFile {
        url
    }
`;
