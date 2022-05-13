import React from 'react';

import Container from '~components/Atoms/Container';
import ProjectLink from '~components/Atoms/ProjectLink';
import Row from '~components/Atoms/Row';
import {ProjectEntity} from '~types/ProjectEntity';
import {apiFileUrl} from '~utils/fileUrl';
import {Image} from '~components/Sections/ProjectGroup/styles';

export type PGListProps = {
    projects: ProjectEntity[];
};

const PGList: React.FC<PGListProps> = ({projects}) => {
    return (
        <section>
            <Container>
                <Row>
                    {projects.map((project) => (
                        <ProjectLink
                            key={project.url}
                            href={project.url}
                            type={project.type}
                        >
                            <div>
                                {project.cover && (
                                    <Image
                                        src={apiFileUrl(project.cover?.url)}
                                        alt={project.name}
                                    />
                                )}
                                {project.name}
                                {project.url}
                            </div>
                        </ProjectLink>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default PGList;
