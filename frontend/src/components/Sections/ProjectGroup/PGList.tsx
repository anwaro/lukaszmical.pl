import React from 'react';

import Container from '~components/Atoms/Container';
import ProjectLink from '~components/Atoms/ProjectLink';
import Row from '~components/Atoms/Row';
import s from '~components/Sections/ProjectGroup/styles.module.scss';
import {ProjectEntity} from '~types/ProjectEntity';
import {apiFileUrl} from '~utils/fileUrl';

export type PGListProps = {
    projects: ProjectEntity[];
};

const PGList: React.FC<PGListProps> = ({projects}) => {
    return (
        <section>
            <Container>
                <Row>
                    {projects.map((project) => (
                        <ProjectLink href={project.url} type={project.type}>
                            <div>
                                {project.cover && (
                                    <img
                                        className={s.image}
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
