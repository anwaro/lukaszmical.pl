import React from 'react';

import Link from 'next/link';

import {ProjectType} from '@/types/supabase/projects';

type ProjectLinkProps = {
    type: ProjectType;
    url: string;
};

export const ProjectLink: FCC<ProjectLinkProps> = ({children, type, url}) => {
    switch (type) {
        case 'project':
            return <a href={`/projects/${url}`}>{children}</a>;
        case 'page':
            return <Link href={`/showcase/${url}`}>{children}</Link>;
        case 'external':
        default:
            return (
                <a href={url} target={'_blank'}>
                    {children}
                </a>
            );
    }
};
