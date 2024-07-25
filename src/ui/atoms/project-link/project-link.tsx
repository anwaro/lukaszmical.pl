import Link from 'next/link';
import React from 'react';
import {ProjectRow} from '@/types/supabase/projects';

type ProjectLinkProps = {
    project: ProjectRow;
};

export const ProjectLink: FCC<ProjectLinkProps> = ({children, project}) => {
    switch (project.type) {
        case 'project':
            return <a href={`/projects/${project.url}`}>{children}</a>;
        case 'page':
            return <Link href={`/showcase/${project.url}`}>{children}</Link>;
        case 'external':
        default:
            return (
                <a href={project.url} target={'_blank'}>
                    {children}
                </a>
            );
    }
};
