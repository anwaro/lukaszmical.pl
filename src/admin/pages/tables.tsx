'use client';

import {mdiGithub, mdiMonitorCellphone, mdiTableBorder, mdiTableOff} from '@mdi/js';
import React from 'react';
import Button from '../components/Button';
import CardBox from '../components/CardBox';
import CardBoxComponentEmpty from '../components/CardBox/Component/Empty';
import NotificationBar from '../components/NotificationBar';
import SectionMain from '../components/Section/Main';
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton';
import TableSampleClients from '../components/Table/SampleClients';

export const TablesPage = () => {
    return (
        <SectionMain>
            <SectionTitleLineWithButton icon={mdiTableBorder} title="Tables" main>
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

            <NotificationBar color="info" icon={mdiMonitorCellphone}>
                <b>Responsive table.</b> Collapses on mobile
            </NotificationBar>

            <CardBox className="mb-6" hasTable>
                <TableSampleClients />
            </CardBox>

            <SectionTitleLineWithButton icon={mdiTableOff} title="Empty variation" />

            <NotificationBar color="danger" icon={mdiTableOff}>
                <b>Empty card.</b> When there&apos;s nothing to show
            </NotificationBar>

            <CardBox>
                <CardBoxComponentEmpty />
            </CardBox>
        </SectionMain>
    );
};
