import type {Metadata} from 'next';

import {cache} from 'react';

import {getLocalizedEntry} from '@/services/content/entry-store';
import {resolveEntryVisibility} from '@/services/content/entry-visibility';
import {HOMEPAGE_SLUG} from '@/types/entry';
import {Locale} from '@/types/locale';
import {draftMetadata, entryMetadata} from '@/utils/seo';

// The homepage is the `page` entry with a reserved slug — there is no
// built-in version of it. Cached per request: metadata and the page both
// need it, and `cache()` only dedupes calls to the same function reference.
const getHomepage = cache((locale: Locale) =>
    getLocalizedEntry('page', HOMEPAGE_SLUG, locale),
);

export class HomepagePageService {
    async getMetadata(locale: Locale): Promise<Metadata> {
        const page = await getHomepage(locale);
        if (!page) {
            return {};
        }
        return page.published ? entryMetadata(page, locale, '/') : draftMetadata;
    }

    async getVisibleEntry(locale: Locale) {
        return resolveEntryVisibility(await getHomepage(locale));
    }
}
