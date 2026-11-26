import React from 'react';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/section/section-main';
import {PageHeader} from '@/admin/components/section/page-header';
import {CreateEntryForm} from '@/admin/components/form/forms/entry/create-entry-form/create-entry-form';

import {CreateEntryPageService} from './create-entry-page-service';

type Props = {
    searchParams: Promise<{kind?: string}>;
};

const service = new CreateEntryPageService();

export default async function PrivatePage({searchParams}: Props) {
    await auth();
    const kind = service.resolveKind((await searchParams).kind);

    return (
        <SectionMain>
            <PageHeader title={service.getTitle(kind)} />
            <CreateEntryForm kind={kind} />
        </SectionMain>
    );
}
