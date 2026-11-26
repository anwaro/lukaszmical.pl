import type {Metadata} from 'next';

import React from 'react';

import {Locale} from '@/types/locale';
import {JsonLd} from '@/ui/components/seo/json-ld';
import {ProjectIframe} from '@/ui/pages/project/iframe/project-iframe';
import {ProjectPage} from '@/ui/pages/project/project-page';

import {ProjectPageService} from './project-page-service';

type Props = {
    params: Promise<{
        locale: Locale;
        slug: string;
    }>;
};

const service = new ProjectPageService();

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    return service.getMetadata(slug, locale);
}

export default async function Page({params}: Props) {
    const {slug, locale} = await params;
    const resolution = await service.resolve(slug, locale);

    if (resolution.presentation === 'article') {
        return (
            <>
                <JsonLd data={resolution.jsonLd} />
                <ProjectPage
                    project={resolution.project}
                    others={resolution.others}
                    editHref={resolution.editHref}
                />
            </>
        );
    }

    return (
        <>
            <JsonLd data={resolution.jsonLd} />
            <ProjectIframe html={resolution.html} />
        </>
    );
}
