export const queryToString = (query: string | string[] | undefined, glue = '') => {
    if (typeof query === 'undefined') {
        return '';
    }
    if (typeof query === 'string') {
        return query;
    }
    return query.join(glue);
};
