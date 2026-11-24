import React from 'react';

import {mdiHome, mdiOpenInNew} from '@mdi/js';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/Section/Main';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
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
            <SectionTitleLineWithButton icon={mdiHome} title="Homepage" main>
                <Button
                    icon={mdiOpenInNew}
                    href={'/'}
                    target={'_blank'}
                    label={'Open'}
                    color={'info'}
                    asAnchor
                    small
                />
            </SectionTitleLineWithButton>
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
