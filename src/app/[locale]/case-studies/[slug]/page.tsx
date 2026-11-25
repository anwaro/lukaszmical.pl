import type {Metadata} from 'next';

import React, {cache} from 'react';

import {notFound} from 'next/navigation';

import {EntryRepository} from '@/services/content/repository-entry';
import {resolveEntryVisibility} from '@/services/content/entry-visibility';
import {Locale} from '@/types/locale';
import {PageCaseStudy} from '@/ui/pages/case-study/case-study';
import {JsonLd} from '@/ui/components/seo/json-ld';
import {draftMetadata, entryJsonLd, entryMetadata} from '@/utils/seo';

type Props = {
    params: Promise<{
        locale: Locale;
        slug: string;
    }>;
};

// Cached per request: generateMetadata and the page both need it.
const getCaseStudy = cache((slug: string, locale: Locale) =>
    new EntryRepository().getLocalized('case_study', slug, locale),
);

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    const caseStudy = await getCaseStudy(slug, locale);

    if (!caseStudy) {
        return {};
    }

    return caseStudy.published
        ? entryMetadata(caseStudy, locale, `/case-studies/${slug}`)
        : draftMetadata;
}

export default async function Page({params}: Props) {
    const {slug, locale} = await params;
    const visible = await resolveEntryVisibility(await getCaseStudy(slug, locale));

    if (!visible) {
        notFound();
    }

    const {entry: caseStudy, editHref} = visible;

    const list = await new EntryRepository().list(locale, {
        kind: 'case_study',
    });
    const index = list.findIndex((item) => item.id === caseStudy.id);
    // Unpublished drafts are not on the list: number them last, link to the first.
    const position = index === -1 ? list.length + 1 : index + 1;
    const next = list.length ? list[(index + 1) % list.length] : null;

    return (
        <>
            <JsonLd
                data={entryJsonLd(caseStudy, locale, `/case-studies/${slug}`)}
            />
            <PageCaseStudy
                caseStudy={caseStudy}
                position={position}
                next={next && next.id !== caseStudy.id ? next : null}
                editHref={editHref}
            />
        </>
    );
}
