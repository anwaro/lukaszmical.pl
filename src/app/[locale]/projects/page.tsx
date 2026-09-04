import type {Metadata} from 'next';

import React from 'react';


import {DrizzleProject} from '@/services/drizzle/drizzle-project';
import {ProjectLocale} from '@/types/project';
import {PageProjects} from '@/ui/pages/project/projects';
import {metadataForPage} from '@/utils/seo';

type Props = {
    params: Promise<{
        locale: ProjectLocale;
    }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    return metadataForPage(locale, 'projects', '/projects');
}

export default async function Page({params}: Props) {
    const {locale} = await params;
    const client = new DrizzleProject();

    const projects = await client.getProjectList(locale);

    return <PageProjects projects={projects} />;
}
