'use client';

import React, {useCallback, useState} from 'react';

import {ExternalLink, Pencil} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {BaseTable} from '@/admin/components/table/base-table';
import {EditVisibility} from '@/admin/components/table/entry-table/edit-visibility';
import {Badge} from '@/admin/components/badge/badge';
import {IconButton} from '@/admin/components/button/icon-button';
import {EntryBase} from '@/types/entry';

import {EditPosition} from './edit-position';
import {
    entryDateFormat,
    entrySiteHref,
    presentationLabels,
    updateEntryInList,
} from './entries-table-model';

type Props = {
    entries: EntryBase[];
};

export const EntriesTable = ({entries}: Props) => {
    const [data, setData] = useState(entries);
    const showPresentation = entries.some((entry) => entry.kind === 'project');

    const update = useCallback(
        (id: number, patch: Partial<EntryBase>) =>
            setData((prev) => updateEntryInList(prev, id, patch)),
        [],
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
                            className="h-9 w-16 rounded-md border border-slate-200 object-cover dark:border-slate-800"
                        />
                    ) : (
                        <span className="block h-9 w-16 rounded-md bg-slate-100 dark:bg-slate-800" />
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
                    <span className="whitespace-nowrap tabular-nums">
                        {entryDateFormat.format(new Date(item.createdAt))}
                    </span>
                ),
                position: (item) => <EditPosition entry={item} onUpdate={update} />,
                actions: (item) => (
                    <div className="flex items-center justify-end gap-1">
                        <IconButton
                            icon={ExternalLink}
                            label="Otwórz na stronie"
                            href={entrySiteHref(item)}
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
