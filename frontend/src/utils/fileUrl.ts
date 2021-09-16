import {trim} from '~utils/string';

export const apiFileUrl = (file: string) => {
    return `${trim(process.env.NEXT_PUBLIC_API_URL || '', '/')}/${trim(file, '/')}`;
};
