import {GetStaticProps} from 'next';
import {useTranslation} from 'next-i18next';
import React from 'react';

import ProjectList from '~components/Project/List';
import {Project} from '~interfaces/project';
import {getProjectsInfos} from '~utils/project';
import {withTranslations} from '~utils/withTranslations';

import Layout from '../src/components/Layout/Layout';

type ProjectsProps = {
    projects: Project[];
};

const Projects = ({projects}: ProjectsProps) => {
    const {t} = useTranslation('contact');
    return (
        <Layout seo={{title: t('title')}}>
            <div>Projects</div>
            <ProjectList projects={projects} />
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({locale}) => {
    const projects = await getProjectsInfos();
    return await withTranslations(locale, ['common', 'projects'], {
        projects: projects
            .filter((p) => p.published)
            .sort((a, b) => a.order - b.order),
    });
};

export default Projects;
