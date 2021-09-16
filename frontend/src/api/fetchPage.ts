import {PAGE_QUERY} from '~graphql/page';

import {apolloClient} from './appoloClient';

export const fetchPage = async (slug: string) => {
    const {data} = await apolloClient.query({query: PAGE_QUERY, variables: {slug}});

    if (data.pages.length) {
        return data.pages[0];
    }
    return undefined;
};
