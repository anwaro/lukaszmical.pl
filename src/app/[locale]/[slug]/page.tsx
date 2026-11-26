import type {Metadata} from 'next';

import React from 'react';

import {notFound} from 'next/navigation';

import {Locale} from '@/types/locale';
import {PageStatic} from '@/ui/pages/static/static-page';

import {StaticPageService} from './static-page-service';

type Props = {
    params: Promise<{
        locale: Locale;
        slug: string;
    }>;
};

const service = new StaticPageService();

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    return service.getMetadata(slug, locale);
}

export default async function Page({params}: Props) {
    const {slug, locale} = await params;
    const visible = await service.getVisibleEntry(slug, locale);

    if (!visible) {
        notFound();
    }

    const {entry: page, editHref} = visible;

    return (
        <PageStatic source={page.content} locale={locale} editHref={editHref} />
    );
}
