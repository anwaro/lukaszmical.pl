import React from 'react';

import {ExternalLink} from 'lucide-react';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/section/section-main';
import {PageHeader} from '@/admin/components/section/page-header';
import {Button} from '@/admin/components/button/button';
import {CreateEntryForm} from '@/admin/components/form/forms/entry/create-entry-form/create-entry-form';
import {EditEntryForm} from '@/admin/components/form/forms/entry/edit-entry-form/edit-entry-form';
import {HOMEPAGE_SLUG} from '@/types/entry';

import {HomepageAdminPageService} from './homepage-admin-page-service';

const service = new HomepageAdminPageService();

export default async function PrivatePage() {
    await auth();
    const homepage = await service.getHomepage();

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
