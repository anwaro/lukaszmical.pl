import React, {useMemo} from 'react';

import Container from '~components/Atoms/Container';
import Half from '~components/Atoms/Half';
import ProjectLink from '~components/Atoms/ProjectLink';
import Row from '~components/Atoms/Row';
import {ProjectEntity} from '~types/ProjectEntity';
import {apiFileUrl} from '~utils/fileUrl';
import {Image} from '~components/Sections/ProjectGroup/styles';

export type PGHalfProps = {
    projects: ProjectEntity[];
};

const PGHalf: React.FC<PGHalfProps> = ({projects}) => {
    const project = useMemo(() => (projects.length ? projects[0] : undefined), []);

    return project ? (
        <section>
            <Container>
                <Row>
                    <Half>
                        {project.cover && (
                            <Image
                                src={apiFileUrl(project.cover?.url)}
                                alt={project.name}
                            />
                        )}
                    </Half>
                    <Half>
                        <h2>{project.name}</h2>
                        <p>{project.description}</p>
                        <ProjectLink href={project.url} type={project.type}>
                            <button>{project.url}</button>
                        </ProjectLink>
                    </Half>
                </Row>
            </Container>
        </section>
    ) : null;
};

export default PGHalf;
