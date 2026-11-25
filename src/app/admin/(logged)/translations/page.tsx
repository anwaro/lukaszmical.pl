import React from 'react';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/section/section-main';
import {PageHeader} from '@/admin/components/section/page-header';
import {MessagesForm} from '@/admin/components/form/forms/messages/messages-form';
import {loadContentValues} from '@/admin/content-values';

export default async function PrivatePage() {
    await auth();
    const {messages} = await loadContentValues();

    return (
        <SectionMain>
            <PageHeader
                title="Tłumaczenia"
                description="Teksty interfejsu strony w obu językach. Zmienione pola mają bursztynowy obrys."
            />
            <MessagesForm messages={messages} />
        </SectionMain>
    );
}
