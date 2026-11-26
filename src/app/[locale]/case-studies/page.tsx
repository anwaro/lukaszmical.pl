import type {Metadata} from 'next';

import React from 'react';

import {Locale} from '@/types/locale';
import {PageCaseStudies} from '@/ui/pages/case-study/case-studies';

import {CaseStudiesPageService} from './case-studies-page-service';

type Props = {
    params: Promise<{
        locale: Locale;
    }>;
};

const service = new CaseStudiesPageService();

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    return service.getMetadata(locale);
}

export default async function Page({params}: Props) {
    const {locale} = await params;
    const caseStudies = await service.getCaseStudies(locale);

    return <PageCaseStudies caseStudies={caseStudies} />;
}
