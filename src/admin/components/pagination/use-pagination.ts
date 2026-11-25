import {useMemo, useState} from 'react';

// Client-side pagination over an array already in memory. `page` is clamped
// to the current item count, so a shrinking list (e.g. a delete) never
// strands the view on a page that no longer exists.
export function usePagination<Item>(items: Item[], limit: number) {
    const [requestedPage, setPage] = useState(0);

    const pageCount = Math.ceil(items.length / limit);
    const page = Math.min(requestedPage, Math.max(pageCount - 1, 0));

    const pageItems = useMemo(
        () => items.slice(limit * page, limit * (page + 1)),
        [items, limit, page],
    );

    return {page, setPage, pageCount, pageItems};
}
