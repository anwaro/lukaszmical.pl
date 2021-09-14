import {GetStaticProps} from 'next';
import React from 'react';

import ProjectList from '~components/Project/List';
import {Project} from '~interfaces/project';
import {getProjectsInfos} from '~utils/project';

import Layout from '../src/components/Layout/Layout';

type ProjectsProps = {
    projects: Project[];
};

const Projects = ({projects}: ProjectsProps) => (
    <Layout seo={{title: 'Projects'}}>
        <div>Projects</div>
        <ProjectList projects={projects} />
    </Layout>
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
