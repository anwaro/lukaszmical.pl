'use client';

import React, {useCallback, useState} from 'react';

import {ExternalLink, Pencil} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {BaseTable} from '@/admin/components/table/base-table';
import {EditVisibility} from '@/admin/components/table/entry-table/edit-visibility';
import {Badge} from '@/admin/components/badge/badge';
import {IconButton} from '@/admin/components/button/icon-button';
import {EntryBase, EntryPresentation, HOMEPAGE_SLUG} from '@/types/entry';

import {EditPosition} from './edit-position';

type Props = {
    entries: EntryBase[];
};

const presentationLabels: Record<EntryPresentation, string> = {
    article: 'Artykuł',
    app: 'Aplikacja',
    link: 'Link',
};

const dateFormat = new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

function siteHref(item: EntryBase): string {
    switch (item.kind) {
        case 'page':
            return item.slug === HOMEPAGE_SLUG ? '/' : `/${item.slug}`;
        case 'case_study':
            return `/case-studies/${item.slug}`;
        default:
            return item.presentation === 'app'
                ? `/api/projects/show?slug=${item.slug}`
                : `/projects/${item.slug}`;
    }
}

export const EntriesTable = ({entries}: Props) => {
    const [data, setData] = useState(entries);
    const showPresentation = entries.some((entry) => entry.kind === 'project');

    const update = useCallback(
        (id: number, patch: Partial<EntryBase>) => {
            setData(data.map((p) => (p.id === id ? {...p, ...patch} : p)));
        },
        [data],
    );

    return (
        <BaseTable
            data={data}
            itemId={(item) => `${item.id}`}
            limit={300}
            empty="Nie ma jeszcze żadnych wpisów."
            columns={{
                cover: {label: 'Okładka'},
                slug: {label: 'Slug', strong: true},
                presentation: showPresentation ? {label: 'Prezentacja'} : undefined,
                published: {label: 'Status'},
                createdAt: {label: 'Utworzono'},
                position: {label: 'Pozycja', numeric: true},
                actions: {
                    label: <span className="sr-only">Akcje</span>,
                    align: 'end',
                },
            }}
            renderData={{
                cover: (item) =>
                    item.cover || item.presentation === 'app' ? (
                        <Image
                            src={
                                item.cover
                                    ? item.cover
                                    : `/projects/${item.slug}/image/cover.jpg`
                            }
                            alt=""
                            height={36}
                            width={64}
                            className="h-9 w-16 rounded-md border border-(--border) object-cover"
                        />
                    ) : (
                        <span className="block h-9 w-16 rounded-md bg-(--surface-sunken)" />
                    ),
                slug: (item) => (
                    <Link
                        href={`/admin/entries/${item.id}`}
                        className="hover:underline"
                    >
                        {item.slug}
                    </Link>
                ),
                presentation: (item) => (
                    <Badge size="sm">{presentationLabels[item.presentation]}</Badge>
                ),
                published: (item) =>
                    item.published ? (
                        <Badge tone="success">Opublikowane</Badge>
                    ) : (
                        <Badge>Szkic</Badge>
                    ),
                createdAt: (item) => (
                    <span className="kv-num whitespace-nowrap">
                        {dateFormat.format(new Date(item.createdAt))}
                    </span>
                ),
                position: (item) => <EditPosition entry={item} onUpdate={update} />,
                actions: (item) => (
                    <div className="flex items-center justify-end gap-1">
                        <IconButton
                            icon={ExternalLink}
                            label="Otwórz na stronie"
                            href={siteHref(item)}
                            target="_blank"
                        />
                        <IconButton
                            icon={Pencil}
                            label="Edytuj"
                            href={`/admin/entries/${item.id}`}
                        />
                        <EditVisibility entry={item} onUpdate={update} />
                    </div>
                ),
            }}
        />
    );
};
