import type {Metadata} from 'next';

import React from 'react';

import {notFound} from 'next/navigation';

import {DrizzleProject} from '@/services/drizzle/drizzle-project';
import {ProjectLocale} from '@/types/project';
import {PageCaseStudy} from '@/ui/pages/case-study/case-study';
import {JsonLd} from '@/ui/components/seo/json-ld';
import {projectJsonLd, projectMetadata} from '@/utils/seo';

type Props = {
    params: Promise<{
        locale: ProjectLocale;
        slug: string;
    }>;
};

async function getCaseStudy(slug: string, locale: ProjectLocale) {
    const caseStudy = await new DrizzleProject().getLocalizedProjectBySlug(
        slug,
        locale,
    );
    return caseStudy?.type === 'case-study' ? caseStudy : null;
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    const caseStudy = await getCaseStudy(slug, locale);

    return caseStudy
        ? projectMetadata(caseStudy, locale, `/case-studies/${slug}`)
        : {};
}

export default async function Page({params}: Props) {
    const {slug, locale} = await params;
    const caseStudy = await getCaseStudy(slug, locale);

    if (!caseStudy) {
        notFound();
    }

    const list = await new DrizzleProject().getProjectList(locale, {
        caseStudies: true,
    });
    const index = list.findIndex((item) => item.id === caseStudy.id);
    // Unpublished drafts are not on the list: number them last, link to the first.
    const position = index === -1 ? list.length + 1 : index + 1;
    const next = list.length ? list[(index + 1) % list.length] : null;

    return (
        <>
            <JsonLd
                data={projectJsonLd(caseStudy, locale, `/case-studies/${slug}`)}
            />
            <PageCaseStudy
                caseStudy={caseStudy}
                position={position}
                next={next && next.id !== caseStudy.id ? next : null}
            />
        </>
    );
}
