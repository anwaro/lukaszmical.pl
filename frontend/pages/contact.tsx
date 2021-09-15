import {GetStaticProps} from 'next';
import {useTranslation} from 'next-i18next';
import React from 'react';

import PageTitle from '~components/Atoms/PageTitle';
import {withTranslations} from '~utils/withTranslations';

import Layout from '../src/components/Layout/Layout';

const Projects = () => {
    const {t} = useTranslation('contact');
    return (
        <Layout seo={{title: t('title')}}>
            <PageTitle>{t('wip')}</PageTitle>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({locale}) =>
    await withTranslations(locale, ['common', 'contact']);

export default Projects;
