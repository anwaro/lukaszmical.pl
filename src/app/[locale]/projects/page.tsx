import React from 'react';

import {SupabaseProject} from '@/services/supabase/SupabaseProject';
import {ProjectLocale} from '@/types/supabase/projects';
import {PageProjects} from '@/ui/pages/project/projects';

type Props = {
    params: {
        locale: ProjectLocale;
    };
};

export default async function Page({params}: Props) {
    const client = new SupabaseProject();

    const projects = await client.getProjectList(params.locale);

    return <PageProjects projects={projects} />;
}
