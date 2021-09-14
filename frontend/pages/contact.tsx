import {GetStaticProps} from 'next';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import React from 'react';

import Layout from '../src/components/Layout/Layout';

const Projects = () => {
    const {t} = useTranslation('contact');
    return (
        <Layout seo={{title: t('title')}}>
            <div>{t('wip')}</div>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({locale, defaultLocale}) => ({
    props: {
        ...(await serverSideTranslations(locale || `${defaultLocale}`, [
            'common',
            'contact',
        ])),
    },
});

export default Projects;
