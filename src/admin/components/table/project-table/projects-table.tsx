'use client';

import React, {useCallback, useState} from 'react';

import {mdiOpenInNew, mdiPencil} from '@mdi/js';
import Image from 'next/image';

import {BaseTable} from '@/admin/components/table/base-table';
import {ProjectRow} from '@/types/supabase/projects';
import {EditVisibility} from '@/admin/components/table/project-table/edit-visibility';

import {Button} from '../../button/button';
import ButtonsGroup from '../../button/buttons-group';
import {EditOrder} from './edit-order';

type Props = {
    projects: ProjectRow[];
};

export const ProjectsTable = ({projects}: Props) => {
    const [data, setData] = useState(projects);

    const update = useCallback(
        (id: number, patch: Partial<ProjectRow>) => {
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
                url: 'Url',
                cover: 'Cover',
                createdAt: 'Created at',
                order: 'Order',
                actions: '',
            }}
            renderData={{
                order: (item) => <EditOrder project={item} onUpdate={update} />,
                cover: (item) => (
                    <Image
                        src={
                            item.cover
                                ? item.cover
                                : `/projects/${item.url}/image/cover.jpg`
                        }
                        alt={item.url}
                        height={40}
                        width={80}
                    />
                ),
                createdAt: (item) => (
                    <small className="text-slate-400">
                        {new Date(item.createdAt).toDateString()}
                    </small>
                ),
                actions: (item) => (
                    <ButtonsGroup type="justify-start lg:justify-end" noWrap>
                        <Button
                            href={`/api/projects/show?slug=${item.url}`}
                            color="info"
                            icon={mdiOpenInNew}
                            title={'Edit project'}
                            target={'_blank'}
                            asAnchor
                            small
                        />
                        <Button
                            href={`/admin/projects/${item.id}`}
                            color="info"
                            icon={mdiPencil}
                            title={'Edit project'}
                            asAnchor
                            small
                        />
                        <EditVisibility project={item} onUpdate={update} />
                    </ButtonsGroup>
                ),
            }}
        />
    );
};
