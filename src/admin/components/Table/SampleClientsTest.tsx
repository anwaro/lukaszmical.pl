'use client';

import {mdiEye, mdiTrashCan} from '@mdi/js';
import React from 'react';
import {useSampleClients} from '../../hooks/sampleData';
import Button from '../Button';
import Buttons from '../Buttons';
import UserAvatar from '../UserAvatar';
import {Table} from '@/admin/components/Table/Table';

export const TableSampleClientsTest = () => {
    const {clients} = useSampleClients();

    return (
        <Table
            data={clients}
            itemId={(item) => `${item.id}`}
            renderData={{
                id: (item) => (
                    <UserAvatar
                        username={item.name}
                        className="w-24 h-24 mx-auto lg:w-6 lg:h-6"
                    />
                ),
                progress: (item) => (
                    <progress
                        className="flex w-2/5 self-center lg:w-full"
                        max="100"
                        value={item.progress}
                    >
                        {item.progress}
                    </progress>
                ),
                created: (item) => (
                    <small className="text-gray-500 dark:text-slate-400">
                        {item.created}
                    </small>
                ),
                actions: () => (
                    <Buttons type="justify-start lg:justify-end" noWrap>
                        <Button color="info" icon={mdiEye} small />
                        <Button color="danger" icon={mdiTrashCan} small />
                    </Buttons>
                ),
            }}
            head={{
                id: '',
                name: 'Name',
                company: 'Company',
                city: 'City',
                progress: 'Progress',
                created: 'Created',
                actions: '',
            }}
        />
    );
};
