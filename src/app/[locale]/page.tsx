import type {Metadata} from 'next';

import React from 'react';


import {ProjectLocale} from '@/types/project';
import {PageHomepage} from '@/ui/pages/homepage/homepage';
import {metadataForPage} from '@/utils/seo';

type Props = {
    params: Promise<{locale: ProjectLocale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    return metadataForPage(locale, 'homepage', '/');
}

export default function Page() {
    return <PageHomepage />;
}
