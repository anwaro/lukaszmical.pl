import React from 'react';

import {mdiTableBorder} from '@mdi/js';

import {auth} from '@/utils/supabase/auth';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import SectionMain from '@/admin/components/Section/Main';
import {CreateProjectForm} from '@/admin/components/form/forms/project/create-project-form/create-project-form';

export default async function PrivatePage() {
    await auth();

    return (
        <SectionMain>
            <SectionTitleLineWithButton
                icon={mdiTableBorder}
                title={'Create new project'}
                main
            />
            <CreateProjectForm />
        </SectionMain>
    );
}
