import {EntryBase, EntryPresentation, HOMEPAGE_SLUG} from '@/types/entry';

export const presentationLabels: Record<EntryPresentation, string> = {
    article: 'Artykuł',
    app: 'Aplikacja',
    link: 'Link',
};

export const entryDateFormat = new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

export function entrySiteHref(item: EntryBase): string {
    switch (item.kind) {
        case 'page':
            return item.slug === HOMEPAGE_SLUG ? '/' : `/${item.slug}`;
        case 'case_study':
            return `/case-studies/${item.slug}`;
        default:
            return item.presentation === 'app'
                ? `/api/projects/show?slug=${item.slug}`
                : `/projects/${item.slug}`;
    }
}

export function updateEntryInList(
    data: EntryBase[],
    id: number,
    patch: Partial<EntryBase>,
): EntryBase[] {
    return data.map((item) => (item.id === id ? {...item, ...patch} : item));
}
