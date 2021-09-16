import React from 'react';

import {ProjectEntity} from '~types/ProjectEntity';

export type PGListProps = {
    projects: ProjectEntity[];
};

const PGList: React.FC<PGListProps> = ({projects}) => {
    return (
        <>
            {projects.map((project) => (
                <section>
                    {project.name}
                    {project.url}
                </section>
            ))}
        </>
    );
};

export default PGList;
