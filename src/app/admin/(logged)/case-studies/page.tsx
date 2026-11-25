import React from 'react';

import {Plus} from 'lucide-react';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/section/section-main';
import {PageHeader} from '@/admin/components/section/page-header';
import {Card} from '@/admin/components/card/card';
import {EntriesTable} from '@/admin/components/table/entry-table/entries-table';
import {Button} from '@/admin/components/button/button';
import {EntryRepository} from '@/services/content/repository-entry';

export default async function PrivatePage() {
    await auth();
    const entries = await new EntryRepository().listAll('case_study');

    return (
        <SectionMain>
            <PageHeader
                title="Case studies"
                description="Opisy realizacji pod adresem /case-studies/<slug>."
            >
                <Button icon={Plus} href={'/admin/entries/create?kind=case_study'}>
                    Dodaj case study
                </Button>
            </PageHeader>
            <Card padding="none">
                <EntriesTable entries={entries} />
            </Card>
        </SectionMain>
    );
}
