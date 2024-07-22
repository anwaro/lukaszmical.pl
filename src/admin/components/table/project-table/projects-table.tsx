'use client';

import {mdiPencil} from '@mdi/js';
import React, {useCallback, useState} from 'react';
import Button from '../../Button';
import Buttons from '../../Buttons';
import {BaseTable} from '@/admin/components/table/base-table';
import {ProjectRow} from '@/types/supabase/projects';
import Image from 'next/image';
import {EditOrder} from './edit-order';
import {EditVisibility} from '@/admin/components/table/project-table/edit-visibility';

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
                name: 'Name',
                cover: 'Cover',
                createdAt: 'Created at',
                order: 'Order',
                actions: '',
            }}
            renderData={{
                order: (item) => <EditOrder project={item} onUpdate={update} />,
                cover: (item) => (
                    <Image
                        src={`/projects/${item.slug}/image/cover.jpg`}
                        alt={item.name}
                        height={40}
                        width={80}
                    />
                ),
                createdAt: (item) => (
                    <small className="text-gray-500 dark:text-slate-400">
                        {new Date(item.createdAt).toDateString()}
                    </small>
                ),
                actions: (item) => (
                    <Buttons type="justify-start lg:justify-end" noWrap>
                        <Button
                            href={`/admin/projects/${item.id}`}
                            color="info"
                            icon={mdiPencil}
                            title={'Edit project'}
                            asAnchor
                            small
                        />
                        <EditVisibility project={item} onUpdate={update} />
                    </Buttons>
                ),
            }}
        />
    );
};
