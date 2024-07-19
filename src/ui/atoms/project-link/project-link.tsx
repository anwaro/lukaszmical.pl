import Link from 'next/link';
import React from 'react';
import {string} from '@/utils/string';
import {ProjectRow} from '@/types/supabase/projects';

type ProjectLinkProps = {
    href: string;
    type: ProjectRow['type'] | null;
};

const ProjectLink: FCC<ProjectLinkProps> = ({children, href, type}) => {
    if (href) {
        switch (type) {
            case 'project':
                return <a href={`/projects/${href}`}>{children}</a>;
            case 'page':
                return (
                    <Link href={`/${string.trim(href.trim(), '/')}`}>
                        {children}
                    </Link>
                );
            case 'external':
            default:
                return (
                    <a href={href} target={'_blank'}>
                        {children}
                    </a>
                );
        }
    }

    return <>{children}</>;
};

export default ProjectLink;
