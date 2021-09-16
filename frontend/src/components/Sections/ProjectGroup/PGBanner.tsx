import React, {useMemo} from 'react';

import {ProjectEntity} from '~types/ProjectEntity';

export type PGBannerProps = {
    projects: ProjectEntity[];
};

const PGBanner: React.FC<PGBannerProps> = ({projects}) => {
    const project = useMemo(() => {
        return projects.length ? projects[0] : undefined;
    }, []);
    return project ? (
        <section>
            {project.name}
            {project.url}
        </section>
    ) : null;
};

export default PGBanner;
