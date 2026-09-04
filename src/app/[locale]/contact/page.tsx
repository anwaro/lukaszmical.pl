import type {Metadata} from 'next';

import React from 'react';


import {PageContact} from '@/ui/pages/contact/contact';
import {ProjectLocale} from '@/types/project';
import {metadataForPage} from '@/utils/seo';

type Props = {
    params: Promise<{locale: ProjectLocale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    return metadataForPage(locale, 'contact', '/contact');
}

export default function Page() {
    return <PageContact />;
}
