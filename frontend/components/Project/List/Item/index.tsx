import * as React from 'react';

import {Project} from '~controllers/ProjectsController/projects';

import styles from './styles.scss';

type ProjectItemProps = {
    project: Project;
    width: number;
    height: number;
    top: number;
    left: number;
};

const ProjectItem = ({project, width, height, left, top}: ProjectItemProps) => (
    <a href={`/project/${project.url}`}>
        <div className={styles.item} style={{width, height, left, top}}>
            <img
                className={styles.image}
                src={`/assets/${project.url}/image/cover.jpg`}
                alt={project.name}
            />
        </div>
    </a>
);

export default ProjectItem;
