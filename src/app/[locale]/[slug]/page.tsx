import type {Metadata} from 'next';

import React from 'react';

import {notFound} from 'next/navigation';

import {EntryRepository} from '@/services/content/repository-entry';
import {HOMEPAGE_SLUG} from '@/types/entry';
import {Locale} from '@/types/locale';
import {PageStatic} from '@/ui/pages/static/static-page';
import {entryMetadata} from '@/utils/seo';

type Props = {
    params: Promise<{
        locale: Locale;
        slug: string;
    }>;
};

// The homepage entry is served at `/`, not under its slug.
async function getPage(slug: string, locale: Locale) {
    return slug === HOMEPAGE_SLUG
        ? null
        : new EntryRepository().getLocalized('page', slug, locale);
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    const page = await getPage(slug, locale);

    return page ? entryMetadata(page, locale, `/${slug}`) : {};
}

export default async function Page({params}: Props) {
    const {slug, locale} = await params;
    const page = await getPage(slug, locale);

    if (!page) {
        notFound();
    }

    return <PageStatic source={page.content} locale={locale} />;
}
