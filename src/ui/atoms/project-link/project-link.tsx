import Link from 'next/link';
import React from 'react';
import {ProjectRow} from '@/types/supabase/projects';

type ProjectLinkProps = {
    project: ProjectRow;
};

export const ProjectLink: FCC<ProjectLinkProps> = ({children, project}) => {
    switch (project.type) {
        case 'project':
            return <a href={`/projects/${project.slug}`}>{children}</a>;
        case 'page':
            return <Link href={`/showcase/${project.slug}`}>{children}</Link>;
        case 'external':
        default:
            return (
                <a href={project.slug} target={'_blank'}>
                    {children}
                </a>
            );
    }
};
