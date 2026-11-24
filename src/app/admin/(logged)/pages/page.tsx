import React from 'react';

import {mdiFileDocumentMultiple, mdiPlus} from '@mdi/js';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/Section/Main';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import CardBox from '@/admin/components/CardBox';
import {EntriesTable} from '@/admin/components/table/entry-table/entries-table';
import {Button} from '@/admin/components/button/button';
import {EntryRepository} from '@/services/content/repository-entry';

export default async function PrivatePage() {
    await auth();
    const entries = await new EntryRepository().listAll('page');

    return (
        <SectionMain>
            <SectionTitleLineWithButton icon={mdiFileDocumentMultiple} title="Pages" main>
                <Button
                    icon={mdiPlus}
                    href={'/admin/entries/create?kind=page'}
                    label={'Create new'}
                    color={'success'}
                    asAnchor
                    small
                />
            </SectionTitleLineWithButton>
            <CardBox className="mb-6" hasTable>
                <EntriesTable entries={entries} />
            </CardBox>
        </SectionMain>
    );
}
