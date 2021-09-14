import {GetStaticProps} from 'next';
import React from 'react';

import ProjectList from '~components/Project/List';
import {Project} from '~interfaces/project';

import Index from '../src/components/Layout/Layout';
import {getProjectsInfos} from '../src/utils/project';

type ProjectsProps = {
    projects: Project[];
};

const Projects = ({projects}: ProjectsProps) => (
    <Index>
        <div>Projects</div>
        <div>
            <ProjectList projects={projects} />
        </div>
    </Index>
);

export const getStaticProps: GetStaticProps = async () => {
    const projects = await getProjectsInfos();
    return {
        props: {
            projects: projects
                .filter((p) => p.published)
                .sort((a, b) => a.order - b.order),
        },
    };
};

export default Projects;
