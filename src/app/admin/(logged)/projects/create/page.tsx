import React from 'react';

import {mdiTableBorder} from '@mdi/js';

import {auth} from '@/utils/auth/auth';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import SectionMain from '@/admin/components/Section/Main';
import {CreateProjectForm} from '@/admin/components/form/forms/project/create-project-form/create-project-form';

type Props = {
    searchParams: Promise<{type?: string}>;
};

export default async function PrivatePage({searchParams}: Props) {
    await auth();
    const caseStudy = (await searchParams).type === 'case-study';

    return (
        <SectionMain>
            <SectionTitleLineWithButton
                icon={mdiTableBorder}
                title={caseStudy ? 'Create new case study' : 'Create new project'}
                main
            />
            <CreateProjectForm type={caseStudy ? 'case-study' : 'project'} />
        </SectionMain>
    );
}
