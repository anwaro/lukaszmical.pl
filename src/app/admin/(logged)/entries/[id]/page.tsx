import React from 'react';

import {mdiTableBorder} from '@mdi/js';
import {notFound} from 'next/navigation';

import {auth} from '@/utils/auth/auth';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import SectionMain from '@/admin/components/Section/Main';
import {EditEntryForm} from '@/admin/components/form/forms/entry/edit-entry-form/edit-entry-form';
import {EntryRepository} from '@/services/content/repository-entry';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function PrivatePage({params}: Props) {
    await auth();
    const {id} = await params;
    const entry = Number.isInteger(Number(id))
        ? await new EntryRepository().getById(Number(id))
        : null;

    if (!entry) {
        notFound();
    }

    return (
        <SectionMain>
            <SectionTitleLineWithButton
                icon={mdiTableBorder}
                title={entry.texts.pl.title || entry.texts.en.title || entry.slug}
                main
            />
            <EditEntryForm entry={entry} />
        </SectionMain>
    );
}
