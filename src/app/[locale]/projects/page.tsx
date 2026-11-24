import type {Metadata} from 'next';

import React from 'react';


import {EntryRepository} from '@/services/content/repository-entry';
import {Locale} from '@/types/locale';
import {PageProjects} from '@/ui/pages/project/projects';
import {metadataForPage} from '@/utils/seo';

type Props = {
    params: Promise<{
        locale: Locale;
    }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    return metadataForPage(locale, 'projects', '/projects');
}

export default async function Page({params}: Props) {
    const {locale} = await params;
    const projects = await new EntryRepository().list(locale, {kind: 'project'});

    return <PageProjects projects={projects} />;
}
