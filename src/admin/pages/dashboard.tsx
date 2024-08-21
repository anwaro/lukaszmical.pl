'use client';

import React from 'react';

import {
    mdiAccountMultiple,
    mdiCartOutline,
    mdiChartTimelineVariant,
    mdiGithub,
    mdiMonitorCellphone,
} from '@mdi/js';

import TableSampleClients from '@/admin/components/table/SampleClients';

import {Button} from '../components/button/button';
import SectionMain from '../components/Section/Main';
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton';
import CardBoxWidget from '../components/CardBox/Widget';
import {useSampleClients, useSampleTransactions} from '../hooks/sampleData';
import CardBoxTransaction from '../components/CardBox/Transaction';
import {Client, Transaction} from '../interfaces';
import CardBoxClient from '../components/CardBox/Client';
import SectionBannerStarOnGitHub from '../components/Section/Banner/StarOnGitHub';
import CardBox from '../components/CardBox';
import NotificationBar from '../components/NotificationBar';

export const DashboardPage = () => {
    const {clients} = useSampleClients();
    const {transactions} = useSampleTransactions();

    const clientsListed = clients.slice(0, 4);

    return (
        <>
            <SectionMain>
                <SectionTitleLineWithButton
                    icon={mdiChartTimelineVariant}
                    title="Overview"
                    main
                >
                    <Button
                        href="https://github.com/justboil/admin-one-react-tailwind"
                        target="_blank"
                        icon={mdiGithub}
                        label="Star on GitHub"
                        color="contrast"
                        roundedFull
                        small
                    />
                </SectionTitleLineWithButton>

                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <CardBoxWidget
                        trendLabel="12%"
                        trendType="up"
                        trendColor="success"
                        icon={mdiAccountMultiple}
                        iconColor="success"
                        number={512}
                        label="Clients"
                    />
                    <CardBoxWidget
                        trendLabel="16%"
                        trendType="down"
                        trendColor="danger"
                        icon={mdiCartOutline}
                        iconColor="info"
                        number={7770}
                        numberPrefix="$"
                        label="Sales"
                    />
                    <CardBoxWidget
                        trendLabel="Overflow"
                        trendType="warning"
                        trendColor="warning"
                        icon={mdiChartTimelineVariant}
                        iconColor="danger"
                        number={256}
                        numberSuffix="%"
                        label="Performance"
                    />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="flex flex-col justify-between">
                        {transactions.map((transaction: Transaction) => (
                            <CardBoxTransaction
                                key={transaction.id}
                                transaction={transaction}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col justify-between">
                        {clientsListed.map((client: Client) => (
                            <CardBoxClient key={client.id} client={client} />
                        ))}
                    </div>
                </div>

                <div className="my-6">
                    <SectionBannerStarOnGitHub />
                </div>

                <SectionTitleLineWithButton
                    icon={mdiAccountMultiple}
                    title="Clients"
                />

                <NotificationBar color="info" icon={mdiMonitorCellphone}>
                    <b>Responsive table.</b> Collapses on mobile
                </NotificationBar>

                <CardBox hasTable>
                    <TableSampleClients />
                </CardBox>
            </SectionMain>
        </>
    );
};
