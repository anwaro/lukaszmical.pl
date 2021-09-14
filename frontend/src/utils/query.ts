export const queryToString = (query: string | string[], glue = '') => {
    if (typeof query === 'string') {
        return query;
    }
    return query.join(glue);
};
