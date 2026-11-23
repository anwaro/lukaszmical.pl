import React from 'react';

import {mdiTranslate} from '@mdi/js';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/Section/Main';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import {ContentForm} from '@/admin/components/form/forms/content/content-form';
import {translationGroups} from '@/admin/content-groups';
import {loadContentValues} from '@/admin/content-values';

export default async function PrivatePage() {
    await auth();
    const values = await loadContentValues();
    const groups = translationGroups([values.messages.pl, values.messages.en]);

    return (
        <SectionMain>
            <SectionTitleLineWithButton icon={mdiTranslate} title="Translations" main />
            <ContentForm groups={groups} {...values} />
        </SectionMain>
    );
}
