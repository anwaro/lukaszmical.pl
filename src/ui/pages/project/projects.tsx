'use client';

import React from 'react';

import {ProjectListItem} from '@/types/supabase/projects';
import {ProjectTile} from '@/ui/components';

import {useMouse} from './use-mouse';

type Props = {
    projects: ProjectListItem[];
};

export function PageProjects({projects}: Props) {
    const {ref, actions, mouse} = useMouse<HTMLDivElement>();

    return (
        <div
            ref={ref}
            className="container mx-auto mt-12 grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            {...actions}
        >
            {projects.map((project) => (
                <ProjectTile key={project.id} project={project} mouse={mouse} />
            ))}
        </div>
    );
}
