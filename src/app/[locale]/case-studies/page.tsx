import type {Metadata} from 'next';

import React from 'react';

import {EntryRepository} from '@/services/content/repository-entry';
import {Locale} from '@/types/locale';
import {PageCaseStudies} from '@/ui/pages/case-study/case-studies';
import {metadataForPage} from '@/utils/seo';

type Props = {
    params: Promise<{
        locale: Locale;
    }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    return metadataForPage(locale, 'caseStudies', '/case-studies');
}

export default async function Page({params}: Props) {
    const {locale} = await params;
    const caseStudies = await new EntryRepository().list(locale, {
        kind: 'case_study',
    });

    return <PageCaseStudies caseStudies={caseStudies} />;
}
