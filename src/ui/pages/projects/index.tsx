'use client';

import React from 'react';
import {ProjectRow} from '@/types/supabase/projects';

type Props = {
    projects: ProjectRow[];
};

export function PageProjects({projects}: Props) {
    return (
        <div>
            {'WIP Projects'}
            <pre>{JSON.stringify(projects, null, 2)}</pre>
        </div>
    );
}
