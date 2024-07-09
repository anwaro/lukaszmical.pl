import Link from 'next/link';
import React from 'react';
import {trim} from '@/utils/string';
import {ReactFC} from '@/types/react';
import {ProjectRow} from '@/services/supabase/SupabaseProject';

type ProjectLinkProps = {
    href: string;
    type: ProjectRow['type'] | null;
};

const ProjectLink: ReactFC<ProjectLinkProps> = ({children, href, type}) => {
    if (href) {
        switch (type) {
            case 'project':
                return <a href={`/projects/${href}`}>{children}</a>;
            case 'page':
                return <Link href={`/${trim(href, '/')}`}>{children}</Link>;
            case 'external':
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
