'use client';

import React, {useCallback, useState} from 'react';

import {mdiOpenInNew, mdiPencil} from '@mdi/js';
import Image from 'next/image';

import {BaseTable} from '@/admin/components/table/base-table';
import {EditVisibility} from '@/admin/components/table/entry-table/edit-visibility';
import {EntryBase, HOMEPAGE_SLUG} from '@/types/entry';

import {Button} from '../../button/button';
import ButtonsGroup from '../../button/buttons-group';
import {EditPosition} from './edit-position';

type Props = {
    entries: EntryBase[];
};

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
            head={{
                id: 'Id',
                slug: 'Slug',
                presentation: 'Presentation',
                cover: 'Cover',
                createdAt: 'Created at',
                position: 'Position',
                actions: '',
            }}
            renderData={{
                position: (item) => <EditPosition entry={item} onUpdate={update} />,
                cover: (item) =>
                    item.cover || item.presentation === 'app' ? (
                        <Image
                            src={
                                item.cover
                                    ? item.cover
                                    : `/projects/${item.slug}/image/cover.jpg`
                            }
                            alt={item.slug}
                            height={40}
                            width={80}
                        />
                    ) : null,
                createdAt: (item) => (
                    <small className="text-slate-400">
                        {new Date(item.createdAt).toDateString()}
                    </small>
                ),
                actions: (item) => (
                    <ButtonsGroup type="justify-start lg:justify-end" noWrap>
                        <Button
                            href={siteHref(item)}
                            color="info"
                            icon={mdiOpenInNew}
                            title={'Open on site'}
                            target={'_blank'}
                            asAnchor
                            small
                        />
                        <Button
                            href={`/admin/entries/${item.id}`}
                            color="info"
                            icon={mdiPencil}
                            title={'Edit'}
                            asAnchor
                            small
                        />
                        <EditVisibility entry={item} onUpdate={update} />
                    </ButtonsGroup>
                ),
            }}
        />
    );
};
