import {unstable_cache} from 'next/cache';

import {EntryKind, EntryListItem, LocalizedEntry} from '@/types/entry';
import {Locale} from '@/types/locale';

import {CONTENT_TAG} from './content-store';
import {EntryListFilter, EntryRepository} from './repository-entry';

// Cached reads of entries for the public site, shared across requests and
// expired by every admin write through CONTENT_TAG. Without it each page view
// (a language switch included) queries the database again. Drafts are cached
// too — who may see them is decided per request by `resolveEntryVisibility`.

const getCachedLocalized = unstable_cache(
    (kind: EntryKind, slug: string, locale: Locale) =>
        new EntryRepository().getLocalized(kind, slug, locale),
    ['entry-localized'],
    {tags: [CONTENT_TAG]},
);

const getCachedList = unstable_cache(
    (locale: Locale, filter: EntryListFilter) =>
        new EntryRepository().list(locale, filter),
    ['entry-list'],
    {tags: [CONTENT_TAG]},
);

export function getLocalizedEntry(
    kind: EntryKind,
    slug: string,
    locale: Locale,
): Promise<LocalizedEntry | null> {
    return getCachedLocalized(kind, slug, locale);
}

export function listEntries(
    locale: Locale,
    filter: EntryListFilter,
): Promise<EntryListItem[]> {
    // Normalized so `{featured: undefined}` and `{}` share one cache entry.
    return getCachedList(locale, {
        kind: filter.kind,
        featured: Boolean(filter.featured),
    });
}
