import type {Metadata} from 'next';

import React from 'react';

import {notFound} from 'next/navigation';

import {EntryRepository} from '@/services/content/repository-entry';
import {Locale} from '@/types/locale';
import {PageCaseStudy} from '@/ui/pages/case-study/case-study';
import {JsonLd} from '@/ui/components/seo/json-ld';
import {entryJsonLd, entryMetadata} from '@/utils/seo';

type Props = {
    params: Promise<{
        locale: Locale;
        slug: string;
    }>;
};

async function getCaseStudy(slug: string, locale: Locale) {
    return new EntryRepository().getLocalized('case_study', slug, locale);
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    const caseStudy = await getCaseStudy(slug, locale);

    return caseStudy
        ? entryMetadata(caseStudy, locale, `/case-studies/${slug}`)
        : {};
}

export default async function Page({params}: Props) {
    const {slug, locale} = await params;
    const caseStudy = await getCaseStudy(slug, locale);

    if (!caseStudy) {
        notFound();
    }

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
            />
        </>
    );
}
