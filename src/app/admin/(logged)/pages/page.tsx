import React from 'react';

import {Plus} from 'lucide-react';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/section/section-main';
import {PageHeader} from '@/admin/components/section/page-header';
import {Card} from '@/admin/components/card/card';
import {EntriesTable} from '@/admin/components/table/entry-table/entries-table';
import {Button} from '@/admin/components/button/button';
import {EntryListPageService} from '@/admin/pages/entry-list-page-service';

const service = new EntryListPageService();

export default async function PrivatePage() {
    await auth();
    const entries = await service.getEntries('page');

    return (
        <SectionMain>
            <PageHeader
                title="Strony"
                description="Strony statyczne pod adresem /<slug>."
            >
                <Button icon={Plus} href={'/admin/entries/create?kind=page'}>
                    Dodaj stronę
                </Button>
            </PageHeader>
            <Card padding="none">
                <EntriesTable entries={entries} />
            </Card>
        </SectionMain>
    );
}
