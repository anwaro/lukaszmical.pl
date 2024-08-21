import React from 'react';

import {mdiCodeJson, mdiPlus} from '@mdi/js';

import {auth} from '@/utils/supabase/auth';
import SectionMain from '@/admin/components/Section/Main';
import SectionTitleLineWithButton from '@/admin/components/Section/TitleLineWithButton';
import CardBox from '@/admin/components/CardBox';
import {SupabaseProject} from '@/services/supabase/supabase-project';
import {ProjectsTable} from '@/admin/components/table/project-table/projects-table';
import {Button} from '@/admin/components/button/button';

export default async function PrivatePage() {
    await auth();
    const client = new SupabaseProject();
    const projects = await client.getProjects();

    return (
        <SectionMain>
            <SectionTitleLineWithButton icon={mdiCodeJson} title="Projects" main>
                <Button
                    icon={mdiPlus}
                    href={'/admin/projects/create'}
                    label={'Create new'}
                    color={'success'}
                    asAnchor
                    small
                />
            </SectionTitleLineWithButton>
            <CardBox className="mb-6" hasTable>
                <ProjectsTable projects={projects} />
            </CardBox>
        </SectionMain>
    );
}
