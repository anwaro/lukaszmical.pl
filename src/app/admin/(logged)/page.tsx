import React from 'react';

import {mdiTableBorder} from '@mdi/js';

import {auth} from '@/utils/auth/auth';
import {logout} from '@/app/admin/auth/logout/actions';
import SectionMain from '@/admin/components/Section/Main';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';

export default async function PrivatePage() {
    await auth();

    return (
        <>
            <SectionMain>
                <SectionTitleLineWithButton
                    icon={mdiTableBorder}
                    title={'Admin panel'}
                    main
                >
                    <form action={logout}>
                        <button type={'submit'}>Logout</button>
                    </form>
                </SectionTitleLineWithButton>
                <p>Hello admin</p>
            </SectionMain>
        </>
    );
}
