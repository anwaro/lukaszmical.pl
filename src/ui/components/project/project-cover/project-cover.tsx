import React, {useMemo} from 'react';

import Image from 'next/image';
import {clsx} from 'clsx';

import {ProjectListItem} from '@/types/supabase/projects';

type ProjectCoverProps = {
    project: ProjectListItem;
    className: string;
};

export const ProjectCover: FC<ProjectCoverProps> = ({project, className}) => {
    const src = useMemo(() => {
        if (project.cover) {
            return project.cover;
        }
        return `/projects/${project.url}/image/cover.jpg`;
    }, [project]);

    return (
        <Image
            src={src}
            className={clsx('aspect-video object-cover', className)}
            alt={project.name}
            width={600}
            height={337.5}
        />
    );
};
