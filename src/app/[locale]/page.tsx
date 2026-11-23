import type {Metadata} from 'next';

import React from 'react';

import {DrizzleProject} from '@/services/drizzle/drizzle-project';
import {ProjectLocale} from '@/types/project';
import {PageHomepage} from '@/ui/pages/homepage/homepage';
import {JsonLd} from '@/ui/components/seo/json-ld';
import {metadataForPage, personJsonLd} from '@/utils/seo';

type Props = {
    params: Promise<{locale: ProjectLocale}>;
};

// How many projects the homepage lists when none is marked as featured.
const PROJECTS_FALLBACK = 3;

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    return metadataForPage(locale, 'homepage', '/');
}

export default async function Page({params}: Props) {
    const {locale} = await params;
    const client = new DrizzleProject();

    const [caseStudies, featured] = await Promise.all([
        client.getProjectList(locale, {caseStudies: true}),
        client.getProjectList(locale, {featured: true}),
    ]);
    const projects = featured.length
        ? featured
        : (await client.getProjectList(locale)).slice(0, PROJECTS_FALLBACK);

    return (
        <>
            <JsonLd data={personJsonLd()} />
            <PageHomepage caseStudies={caseStudies} projects={projects} />
        </>
    );
}
