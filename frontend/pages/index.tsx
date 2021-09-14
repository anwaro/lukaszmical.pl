import {GetStaticProps} from 'next';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import React from 'react';

import Layout from '~components/Layout/Layout';
import HomepageMenu from '~components/Pages/Homepage/Menu';
import PersonBackground from '~components/Pages/Homepage/PersonBackground';

const Index = () => {
    const {t} = useTranslation('homepage');
    return (
        <Layout seo={{title: t('title')}}>
            <PersonBackground />
            <HomepageMenu />
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({locale, defaultLocale}) => ({
    props: {
        ...(await serverSideTranslations(locale || `${defaultLocale}`, [
            'common',
            'homepage',
        ])),
    },
});

export default Index;
