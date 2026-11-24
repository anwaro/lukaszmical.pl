import type {Metadata} from 'next';

import React, {cache} from 'react';

import {notFound} from 'next/navigation';

import {EntryRepository} from '@/services/content/repository-entry';
import {HOMEPAGE_SLUG} from '@/types/entry';
import {Locale} from '@/types/locale';
import {JsonLd} from '@/ui/components/seo/json-ld';
import {PageStatic} from '@/ui/pages/static/static-page';
import {entryMetadata, personJsonLd} from '@/utils/seo';

type Props = {
    params: Promise<{locale: Locale}>;
};

// The homepage is the `page` entry with a reserved slug — there is no built-in
// version of it. Cached per request: the page and its metadata both need it.
const getHomepage = cache((locale: Locale) =>
    new EntryRepository().getLocalized('page', HOMEPAGE_SLUG, locale),
);

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    const page = await getHomepage(locale);

    return page ? entryMetadata(page, locale, '/') : {};
}

export default async function Page({params}: Props) {
    const {locale} = await params;
    const page = await getHomepage(locale);

    if (!page) {
        notFound();
    }

    return (
        <>
            <JsonLd data={personJsonLd()} />
            <PageStatic source={page.content} locale={locale} />
        </>
    );
}
