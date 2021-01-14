import {GetStaticProps} from 'next';
import React from 'react';

import ProjectList from '~components/Project/List';

import Index from '../components/Layout/Layout';
import {getProjectsInfos} from '../utils/project';

const Projects = ({projects}) => (
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
            projects,
        },
    };
};

export default Projects;
