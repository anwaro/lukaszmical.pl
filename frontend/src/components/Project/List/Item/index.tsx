import React from 'react';

import {Project} from '~interfaces/project';

import styles from './styles.module.scss';

type ProjectItemProps = {
    project: Project;
};

const ProjectItem = ({project}: ProjectItemProps) => (
    <a href={`/projects/${project.slug}`}>
        <div className={styles.item}>
            <img
                className={styles.image}
                src={`/assets/${project.slug}/image/cover.jpg`}
                alt={project.name}
            />
        </div>
    </a>
);

export default ProjectItem;
