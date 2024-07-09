import React from 'react';
import {PageProjects} from '@/ui/pages/projects';
import {SupabaseProject} from '@/services/supabase/SupabaseProject';

export default async function Page() {
    const client = new SupabaseProject();

    const projects = await client.getProjects();

    return <PageProjects projects={projects} />;
}
