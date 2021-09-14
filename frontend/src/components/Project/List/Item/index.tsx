import React from 'react';

import {Project} from '~interfaces/project';

import styles from './styles.module.scss';

type ProjectItemProps = {
    project: Project;
    width: number;
    height: number;
    top: number;
    left: number;
};

const ProjectItem = ({project, width, height, left, top}: ProjectItemProps) => (
    <a href={`/project/${project.slug}`}>
        <div
            className={styles.item}
            style={{width, height, transform: `translate(${left}px, ${top}px)`}}
        >
            <img
                className={styles.image}
                src={`/assets/${project.slug}/image/cover.jpg`}
                alt={project.name}
            />
        </div>
    </a>
);

export default ProjectItem;
