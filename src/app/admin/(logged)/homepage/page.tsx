import React from 'react';

import {mdiHome, mdiOpenInNew} from '@mdi/js';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/Section/Main';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import {Button} from '@/admin/components/button/button';
import {ContentForm} from '@/admin/components/form/forms/content/content-form';
import {homepageGroups} from '@/admin/content-groups';
import {loadContentValues} from '@/admin/content-values';

export default async function PrivatePage() {
    await auth();
    const values = await loadContentValues();

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
            <ContentForm groups={homepageGroups} {...values} />
        </SectionMain>
    );
}
