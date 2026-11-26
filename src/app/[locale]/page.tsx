import type {Metadata} from 'next';

import React from 'react';

import {notFound} from 'next/navigation';

import {Locale} from '@/types/locale';
import {JsonLd} from '@/ui/components/seo/json-ld';
import {PageStatic} from '@/ui/pages/static/static-page';
import {personJsonLd} from '@/utils/seo';

import {HomepagePageService} from './homepage-page-service';

type Props = {
    params: Promise<{locale: Locale}>;
};

const service = new HomepagePageService();

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    return service.getMetadata(locale);
}

export default async function Page({params}: Props) {
    const {locale} = await params;
    const visible = await service.getVisibleEntry(locale);

    if (!visible) {
        notFound();
    }

    const {entry: page, editHref} = visible;

    return (
        <>
            <JsonLd data={personJsonLd()} />
            <PageStatic source={page.content} locale={locale} editHref={editHref} />
        </>
    );
}
