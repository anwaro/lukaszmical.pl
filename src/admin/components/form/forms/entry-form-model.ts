import {EntryInput} from '@/types/entry';

// "2026-11-24 13:00:00+00" (database) -> "2026-11-24T13:00:00" (input value).
export function toDateTimeLocal(value = ''): string {
    return value.replace(' ', 'T').replace(/(\.\d+)?([+-]\d{2}(:?\d{2})?|Z)$/, '');
}

// Bundled apps ship their cover in `public/`; the field shows that path as a
// placeholder instead of an empty box.
export function entryFormCoverPlaceholder(initialState: EntryInput): string {
    if (initialState.presentation === 'app' && initialState.slug) {
        return `/projects/${initialState.slug}/images/cover.jpg`;
    }
    return '';
}

export function entryFormInitialValues(initialState: EntryInput): EntryInput {
    return {
        ...initialState,
        cover: initialState.cover ?? '',
        period: initialState.period ?? '',
        siteUrl: initialState.siteUrl ?? '',
        repoUrl: initialState.repoUrl ?? '',
        linkUrl: initialState.linkUrl ?? '',
        createdAt: toDateTimeLocal(initialState.createdAt),
    };
}
