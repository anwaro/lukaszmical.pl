import type {Metadata} from 'next';

import React from 'react';

import {Locale} from '@/types/locale';
import {PageProjects} from '@/ui/pages/project/projects';

import {ProjectsPageService} from './projects-page-service';

type Props = {
    params: Promise<{
        locale: Locale;
    }>;
};

const service = new ProjectsPageService();

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    return service.getMetadata(locale);
}

export default async function Page({params}: Props) {
    const {locale} = await params;
    const projects = await service.getProjects(locale);

    return <PageProjects projects={projects} />;
}
