import React from 'react';

import {ExternalLink} from 'lucide-react';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/section/section-main';
import {PageHeader} from '@/admin/components/section/page-header';
import {Button} from '@/admin/components/button/button';
import {CreateEntryForm} from '@/admin/components/form/forms/entry/create-entry-form/create-entry-form';
import {EditEntryForm} from '@/admin/components/form/forms/entry/edit-entry-form/edit-entry-form';
import {EntryRepository} from '@/services/content/repository-entry';
import {HOMEPAGE_SLUG} from '@/types/entry';

// The homepage is a `page` entry with a reserved slug; the site has no
// homepage until it is created here.
export default async function PrivatePage() {
    await auth();
    const homepage = await new EntryRepository().getBySlug('page', HOMEPAGE_SLUG);

    return (
        <SectionMain>
            <PageHeader
                title="Strona główna"
                description={
                    homepage
                        ? 'Treść strony pod adresem / zbudowana z bloków.'
                        : 'Strona główna jeszcze nie istnieje — bez niej adres / zwraca 404.'
                }
            >
                <Button
                    variant="secondary"
                    icon={ExternalLink}
                    href={'/'}
                    target={'_blank'}
                >
                    Otwórz
                </Button>
            </PageHeader>
            {homepage ? (
                <EditEntryForm entry={homepage} />
            ) : (
                <CreateEntryForm
                    kind="page"
                    initial={{slug: HOMEPAGE_SLUG, published: true, position: 0}}
                />
            )}
        </SectionMain>
    );
}
