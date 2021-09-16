import React, {useMemo} from 'react';

import {ProjectEntity} from '~types/ProjectEntity';

export type PGHalfProps = {
    projects: ProjectEntity[];
};

const PGHalf: React.FC<PGHalfProps> = ({projects}) => {
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

export default PGHalf;
