import {GetStaticProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import React from 'react';

import Layout from '~components/Layout/Layout';
import HomepageMenu from '~components/Pages/Homepage/Menu';
import PersonBackground from '~components/Pages/Homepage/PersonBackground';

const Index = () => (
    <Layout seo={{title: 'Łukasz Micał | Homepage'}}>
        <PersonBackground />
        <HomepageMenu />
    </Layout>
);

export const getStaticProps: GetStaticProps = async ({locale, defaultLocale}) => ({
    props: {
        ...(await serverSideTranslations(locale || `${defaultLocale}`, [
            'common',
            'homepage',
        ])),
    },
});

export default Index;
