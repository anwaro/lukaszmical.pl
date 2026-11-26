import type {Metadata} from 'next';

import {cache} from 'react';

import {EntryRepository} from '@/services/content/repository-entry';
import {resolveEntryVisibility} from '@/services/content/entry-visibility';
import {LocalizedEntry} from '@/types/entry';
import {Locale} from '@/types/locale';
import {draftMetadata, entryJsonLd, entryMetadata} from '@/utils/seo';

// Cached per request: generateMetadata and the page both need it.
const getCaseStudy = cache((slug: string, locale: Locale) =>
    new EntryRepository().getLocalized('case_study', slug, locale),
);

export class CaseStudyPageService {
    async getMetadata(slug: string, locale: Locale): Promise<Metadata> {
        const caseStudy = await getCaseStudy(slug, locale);
        if (!caseStudy) {
            return {};
        }
        return caseStudy.published
            ? entryMetadata(caseStudy, locale, `/case-studies/${slug}`)
            : draftMetadata;
    }

    async getVisibleEntry(slug: string, locale: Locale) {
        return resolveEntryVisibility(await getCaseStudy(slug, locale));
    }

    getJsonLd(caseStudy: LocalizedEntry, slug: string, locale: Locale) {
        return entryJsonLd(caseStudy, locale, `/case-studies/${slug}`);
    }

    // The case study's number and the next one to read, among the published
    // list. Unpublished drafts are not on that list: number them last, link
    // to the first.
    async getPositionAndNext(caseStudy: LocalizedEntry, locale: Locale) {
        const list = await new EntryRepository().list(locale, {
            kind: 'case_study',
        });
        const index = list.findIndex((item) => item.id === caseStudy.id);
        const position = index === -1 ? list.length + 1 : index + 1;
        const candidate = list.length ? list[(index + 1) % list.length] : null;
        const next = candidate && candidate.id !== caseStudy.id ? candidate : null;

        return {position, next};
    }
}
