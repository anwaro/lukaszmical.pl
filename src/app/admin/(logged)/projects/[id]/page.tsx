import React from 'react';

import {mdiTableBorder} from '@mdi/js';
import {notFound} from 'next/navigation';

import {auth} from '@/utils/supabase/auth';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import SectionMain from '@/admin/components/Section/Main';
import {SupabaseProject} from '@/services/supabase/supabase-project';
import {EditProjectForm} from '@/admin/components/form/forms/project/edit-project-form/edit-project-form';

type Props = {
    params: {
        id: string;
    };
};

export default async function PrivatePage({params}: Props) {
    await auth();
    const client = new SupabaseProject();
    const project = await client.getProjectById(params.id);

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
