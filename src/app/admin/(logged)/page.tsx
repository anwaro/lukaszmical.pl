import React from 'react';

import {mdiTableBorder} from '@mdi/js';

import {auth} from '@/utils/supabase/auth';
import SectionMain from '@/admin/components/Section/Main';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';

export default async function PrivatePage() {
    const user = await auth();

    return (
        <>
            <SectionMain>
                <SectionTitleLineWithButton
                    icon={mdiTableBorder}
                    title={'Admin panel'}
                    main
                >
                    <a href={'/admin/auth/logout'}>Logout</a>
                </SectionTitleLineWithButton>
                <p>Hello {user.email}</p>
            </SectionMain>
        </>
    );
}
