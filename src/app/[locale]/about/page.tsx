import type {Metadata} from 'next';

import React from 'react';


import {About} from '@/ui/pages/about/about';
import {ProjectLocale} from '@/types/project';
import {metadataForPage} from '@/utils/seo';

type Props = {
    params: Promise<{locale: ProjectLocale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    return metadataForPage(locale, 'about', '/about');
}

export default function Page() {
    return <About />;
}
