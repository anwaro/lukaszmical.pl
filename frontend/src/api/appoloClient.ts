import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import fetch from 'isomorphic-unfetch';

const link = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    fetch,
});

const cache = new InMemoryCache();
export const apolloClient = new ApolloClient({cache, link});
