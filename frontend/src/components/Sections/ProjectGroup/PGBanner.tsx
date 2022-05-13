import React, {useMemo} from 'react';

import {ProjectEntity} from '~types/ProjectEntity';
import Container from '~components/Atoms/Container';

export type PGBannerProps = {
    projects: ProjectEntity[];
};

const PGBanner: React.FC<PGBannerProps> = ({projects}) => {
    const project = useMemo(() => (projects.length ? projects[0] : undefined), []);

    return project ? (
        <section>
            <Container>
                {project.name}
                {project.url}
            </Container>
        </section>
    ) : null;
};

export default PGBanner;
