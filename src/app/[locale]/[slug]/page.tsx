import type {Metadata} from 'next';

import React, {cache} from 'react';

import {notFound} from 'next/navigation';

import {EntryRepository} from '@/services/content/repository-entry';
import {resolveEntryVisibility} from '@/services/content/entry-visibility';
import {HOMEPAGE_SLUG} from '@/types/entry';
import {Locale} from '@/types/locale';
import {PageStatic} from '@/ui/pages/static/static-page';
import {draftMetadata, entryMetadata} from '@/utils/seo';

type Props = {
    params: Promise<{
        locale: Locale;
        slug: string;
    }>;
};

// The homepage entry is served at `/`, not under its slug. Cached per
// request: generateMetadata and the page both need it.
const getPage = cache((slug: string, locale: Locale) =>
    slug === HOMEPAGE_SLUG
        ? null
        : new EntryRepository().getLocalized('page', slug, locale),
);

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    const page = await getPage(slug, locale);

    if (!page) {
        return {};
    }

    return page.published ? entryMetadata(page, locale, `/${slug}`) : draftMetadata;
}

export default async function Page({params}: Props) {
    const {slug, locale} = await params;
    const visible = await resolveEntryVisibility(await getPage(slug, locale));

    if (!visible) {
        notFound();
    }

    const {entry: page, editHref} = visible;

    return (
        <PageStatic source={page.content} locale={locale} editHref={editHref} />
    );
}
