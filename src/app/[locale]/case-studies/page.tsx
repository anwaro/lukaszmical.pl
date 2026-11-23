import type {Metadata} from 'next';

import React from 'react';

import {DrizzleProject} from '@/services/drizzle/drizzle-project';
import {ProjectLocale} from '@/types/project';
import {PageCaseStudies} from '@/ui/pages/case-study/case-studies';
import {metadataForPage} from '@/utils/seo';

type Props = {
    params: Promise<{
        locale: ProjectLocale;
    }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    return metadataForPage(locale, 'caseStudies', '/case-studies');
}

export default async function Page({params}: Props) {
    const {locale} = await params;
    const caseStudies = await new DrizzleProject().getProjectList(locale, {
        caseStudies: true,
    });

    return <PageCaseStudies caseStudies={caseStudies} />;
}
