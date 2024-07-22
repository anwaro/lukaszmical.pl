'use client';

import React from 'react';
import {ProjectRow} from '@/types/supabase/projects';
import {ProjectTile} from '@/ui/pages/projects/project-tile/project-tile';
import {useMouse} from '@/ui/pages/projects/use-mouse';

type Props = {
    projects: ProjectRow[];
};

export function PageProjects({projects}: Props) {
    const {ref, actions, mouse} = useMouse<HTMLDivElement>();

    return (
        <div
            ref={ref}
            className="container grid grid-cols-4 gap-4 mx-auto mt-12"
            {...actions}
        >
            {projects.map((project: ProjectRow) => (
                <ProjectTile key={project.id} project={project} mouse={mouse} />
            ))}
        </div>
    );
}
