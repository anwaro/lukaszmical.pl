import React from 'react';

import {Project} from '~interfaces/project';

import ProjectItem from './Item';
import styles from './styles.module.scss';
import useGridLayout from './useGridLayout';

type ProjectListProps = {
    projects: Project[];
};

const ProjectList = ({projects}: ProjectListProps) => {
    const {
        itemWidth,
        itemHeight,
        containerWidth,
        containerHeight,
        columns,
    } = useGridLayout(projects.length, 3);

    const cTop = (i: number) => Math.floor(i / columns) * (itemHeight + 10);
    const cLeft = (i: number) => (i % columns) * (itemWidth + 10);

    return (
        <div className={styles.listWrapper}>
            <div
                className={styles.list}
                style={{width: containerWidth, height: containerHeight}}
            >
                {projects.map((project, i) => (
                    <ProjectItem
                        key={project.slug}
                        project={project}
                        width={itemWidth}
                        height={itemHeight}
                        top={cTop(i)}
                        left={cLeft(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectList;
