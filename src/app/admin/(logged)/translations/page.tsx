import React from 'react';

import {mdiTranslate} from '@mdi/js';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/Section/Main';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import {MessagesForm} from '@/admin/components/form/forms/messages/messages-form';
import {loadContentValues} from '@/admin/content-values';

export default async function PrivatePage() {
    await auth();
    const {messages} = await loadContentValues();

    return (
        <SectionMain>
            <SectionTitleLineWithButton icon={mdiTranslate} title="Translations" main />
            <MessagesForm messages={messages} />
        </SectionMain>
    );
}
