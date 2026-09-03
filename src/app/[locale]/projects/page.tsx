import React from 'react';

import {SupabaseProject} from '@/services/supabase/supabase-project';
import {ProjectLocale} from '@/types/supabase/projects';
import {PageProjects} from '@/ui/pages/project/projects';

type Props = {
    params: Promise<{
        locale: ProjectLocale;
    }>;
};

export default async function Page({params}: Props) {
    const {locale} = await params;
    const client = new SupabaseProject();

    const projects = await client.getProjectList(locale);

    return <PageProjects projects={projects} />;
}
