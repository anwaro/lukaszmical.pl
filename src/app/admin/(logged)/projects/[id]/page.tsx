import React from 'react';

import {mdiTableBorder} from '@mdi/js';
import {notFound} from 'next/navigation';

import {auth} from '@/utils/auth/auth';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import SectionMain from '@/admin/components/Section/Main';
import {DrizzleProject} from '@/services/drizzle/drizzle-project';
import {EditProjectForm} from '@/admin/components/form/forms/project/edit-project-form/edit-project-form';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function PrivatePage({params}: Props) {
    await auth();
    const {id} = await params;
    const client = new DrizzleProject();
    const project = await client.getProjectById(id);

    if (!project) {
        notFound();
    }

    return (
        <SectionMain>
            <SectionTitleLineWithButton
                icon={mdiTableBorder}
                title={project.name.en}
                main
            />
            <EditProjectForm project={project} />
        </SectionMain>
    );
}
