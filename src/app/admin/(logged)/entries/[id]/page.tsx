import React from 'react';

import {notFound} from 'next/navigation';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/section/section-main';
import {PageHeader} from '@/admin/components/section/page-header';
import {Badge} from '@/admin/components/badge/badge';
import {EditEntryForm} from '@/admin/components/form/forms/entry/edit-entry-form/edit-entry-form';
import {EntryRepository} from '@/services/content/repository-entry';
import {entryKindLabels} from '@/admin/entry-kind-labels';

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
            <PageHeader
                title={entry.texts.pl.title || entry.texts.en.title || entry.slug}
                description={
                    <span className="flex flex-wrap items-center gap-2">
                        <Badge size="sm">{entryKindLabels[entry.kind]}</Badge>
                        <span className="font-mono text-xs">{entry.slug}</span>
                    </span>
                }
            />
            <EditEntryForm entry={entry} />
        </SectionMain>
    );
}
