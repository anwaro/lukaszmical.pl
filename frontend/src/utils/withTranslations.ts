import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

export const withTranslations = async (
    locale: string | undefined,
    ns: string[],
    data: Record<string, unknown> = {},
) => {
    return {
        props: {
            ...data,
            ...(await serverSideTranslations(`${locale}`, ns)),
        },
    };
};
