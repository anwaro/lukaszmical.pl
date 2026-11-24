import React from 'react';

import {mdiTableBorder} from '@mdi/js';

import {auth} from '@/utils/auth/auth';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import SectionMain from '@/admin/components/Section/Main';
import {CreateEntryForm} from '@/admin/components/form/forms/entry/create-entry-form/create-entry-form';
import {EntryKind, EntryKindList} from '@/types/entry';

type Props = {
    searchParams: Promise<{kind?: string}>;
};

const titles: Record<EntryKind, string> = {
    page: 'Create new page',
    case_study: 'Create new case study',
    project: 'Create new project',
};

export default async function PrivatePage({searchParams}: Props) {
    await auth();
    const requested = (await searchParams).kind as EntryKind;
    const kind = EntryKindList.includes(requested) ? requested : 'project';

    return (
        <SectionMain>
            <SectionTitleLineWithButton icon={mdiTableBorder} title={titles[kind]} main />
            <CreateEntryForm kind={kind} />
        </SectionMain>
    );
}
