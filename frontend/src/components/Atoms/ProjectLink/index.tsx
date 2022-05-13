import Link from 'next/link';
import React from 'react';

import {ENUM_PROJECTS_TYPE} from '~types/globalTypes';
import {trim} from '~utils/string';
import {ReactFC} from '~types/react';

type ProjectLinkProps = {
    href: string;
    type: ENUM_PROJECTS_TYPE | null;
};

const ProjectLink: ReactFC<ProjectLinkProps> = ({children, href, type}) => {
    if (href) {
        switch (type) {
            case ENUM_PROJECTS_TYPE.project:
                return <a href={`/projects/${href}`}>{children}</a>;
            case ENUM_PROJECTS_TYPE.page:
                return (
                    <Link href={`/${trim(href, '/')}`}>
                        <a href={`/${trim(href, '/')}`}>{children}</a>
                    </Link>
                );
            case ENUM_PROJECTS_TYPE.external:
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
