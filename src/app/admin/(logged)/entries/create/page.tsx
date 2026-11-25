import React from 'react';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/section/section-main';
import {PageHeader} from '@/admin/components/section/page-header';
import {CreateEntryForm} from '@/admin/components/form/forms/entry/create-entry-form/create-entry-form';
import {EntryKind, EntryKindList} from '@/types/entry';

type Props = {
    searchParams: Promise<{kind?: string}>;
};

const titles: Record<EntryKind, string> = {
    page: 'Nowa strona',
    case_study: 'Nowe case study',
    project: 'Nowy projekt',
};

export default async function PrivatePage({searchParams}: Props) {
    await auth();
    const requested = (await searchParams).kind as EntryKind;
    const kind = EntryKindList.includes(requested) ? requested : 'project';

    return (
        <SectionMain>
            <PageHeader title={titles[kind]} />
            <CreateEntryForm kind={kind} />
        </SectionMain>
    );
}
