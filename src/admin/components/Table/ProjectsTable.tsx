'use client';

import {mdiEye, mdiEyeOff, mdiPencil} from '@mdi/js';
import React from 'react';
import Button from '../Button';
import Buttons from '../Buttons';
import {Table} from '@/admin/components/Table/Table';
import {ProjectRow} from '@/types/supabase/projects';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
    projects: ProjectRow[];
};

export const ProjectsTable = ({projects}: Props) => {
    return (
        <Table
            data={projects}
            itemId={(item) => `${item.id}`}
            limit={15}
            head={{
                id: 'Id',
                name: 'Name',
                cover: 'Cover',
                createdAt: 'Created at',
                order: 'Order',
                actions: '',
            }}
            renderData={{
                cover: (item) => (
                    <Image
                        src={`/projects/${item.slug}/image/cover.jpg`}
                        alt={item.name}
                        className="h-10"
                        height={40}
                        width={120}
                    />
                ),
                createdAt: (item) => (
                    <small className="text-gray-500 dark:text-slate-400">
                        {new Date(item.createdAt).toDateString()}
                    </small>
                ),
                actions: (item) => (
                    <Buttons type="justify-start lg:justify-end" noWrap>
                        <Link href={`/admin/projects/${item.id}`}>
                            <Button
                                color="info"
                                icon={mdiPencil}
                                title={'Edit project'}
                                asAnchor
                                small
                            />
                        </Link>
                        <Button
                            color={item.published ? 'danger' : 'success'}
                            title={
                                item.published
                                    ? 'Unpublish project'
                                    : 'Publish project'
                            }
                            icon={item.published ? mdiEyeOff : mdiEye}
                            small
                        />
                    </Buttons>
                ),
            }}
        />
    );
};
