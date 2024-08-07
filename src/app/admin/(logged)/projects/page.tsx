import React from 'react';

import {mdiCodeJson} from '@mdi/js';

import {auth} from '@/utils/supabase/auth';
import SectionMain from '@/admin/components/Section/Main';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import CardBox from '@/admin/components/CardBox';
import {SupabaseProject} from '@/services/supabase/SupabaseProject';
import {ProjectsTable} from '@/admin/components/table/project-table/projects-table';

export default async function PrivatePage() {
    await auth();
    const client = new SupabaseProject();
    const projects = await client.getProjects(false);

    return (
        <SectionMain>
            <SectionTitleLineWithButton icon={mdiCodeJson} title="Projects" main />
            <CardBox className="mb-6" hasTable>
                <ProjectsTable projects={projects} />
            </CardBox>
        </SectionMain>
    );
}
