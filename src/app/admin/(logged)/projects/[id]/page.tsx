import {auth} from '@/utils/supabase/auth';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import {mdiTableBorder} from '@mdi/js';
import React from 'react';
import SectionMain from '@/admin/components/Section/Main';
import {SupabaseProject} from '@/services/supabase/SupabaseProject';
import {notFound} from 'next/navigation';

type Props = {
    params: {
        id: string;
    };
};

export default async function PrivatePage({params}: Props) {
    await auth();
    const client = new SupabaseProject();
    const project = await client.getProject(params.id);

    if (!project) {
        notFound();
    }

    return (
        <SectionMain>
            <SectionTitleLineWithButton
                icon={mdiTableBorder}
                title={project.name}
                main
            />
        </SectionMain>
    );
}
