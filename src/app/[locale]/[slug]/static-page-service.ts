import type {Metadata} from 'next';

import {cache} from 'react';

import {EntryRepository} from '@/services/content/repository-entry';
import {resolveEntryVisibility} from '@/services/content/entry-visibility';
import {HOMEPAGE_SLUG} from '@/types/entry';
import {Locale} from '@/types/locale';
import {draftMetadata, entryMetadata} from '@/utils/seo';

// The homepage entry is served at `/`, not under its slug. Cached per
// request: generateMetadata and the page both need it.
const getPage = cache((slug: string, locale: Locale) =>
    slug === HOMEPAGE_SLUG
        ? null
        : new EntryRepository().getLocalized('page', slug, locale),
);

export class StaticPageService {
    async getMetadata(slug: string, locale: Locale): Promise<Metadata> {
        const page = await getPage(slug, locale);
        if (!page) {
            return {};
        }
        return page.published
            ? entryMetadata(page, locale, `/${slug}`)
            : draftMetadata;
    }

    async getVisibleEntry(slug: string, locale: Locale) {
        return resolveEntryVisibility(await getPage(slug, locale));
    }
}
