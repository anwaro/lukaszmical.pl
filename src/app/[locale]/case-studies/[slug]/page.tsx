import type {Metadata} from 'next';

import React from 'react';

import {notFound} from 'next/navigation';

import {Locale} from '@/types/locale';
import {PageCaseStudy} from '@/ui/pages/case-study/case-study';
import {JsonLd} from '@/ui/components/seo/json-ld';

import {CaseStudyPageService} from './case-study-page-service';

type Props = {
    params: Promise<{
        locale: Locale;
        slug: string;
    }>;
};

const service = new CaseStudyPageService();

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    return service.getMetadata(slug, locale);
}

export default async function Page({params}: Props) {
    const {slug, locale} = await params;
    const visible = await service.getVisibleEntry(slug, locale);

    if (!visible) {
        notFound();
    }

    const {entry: caseStudy, editHref} = visible;
    const {position, next} = await service.getPositionAndNext(caseStudy, locale);

    return (
        <>
            <JsonLd data={service.getJsonLd(caseStudy, slug, locale)} />
            <PageCaseStudy
                caseStudy={caseStudy}
                position={position}
                next={next}
                editHref={editHref}
            />
        </>
    );
}
