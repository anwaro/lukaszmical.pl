import React from 'react';

import {Project} from '~interfaces/project';

import ProjectItem from './Item';
import styles from './styles.module.scss';

type ProjectListProps = {
    projects: Project[];
};

const ProjectList = ({projects}: ProjectListProps) => {
    return (
        <div className={styles.listWrapper}>
            <div className={styles.list}>
                {projects.map((project) => (
                    <ProjectItem key={project.slug} project={project} />
                ))}
            </div>
        </div>
    );
};

export default ProjectList;
