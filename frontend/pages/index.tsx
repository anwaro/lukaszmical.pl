import {GetStaticProps} from 'next';
import {useTranslation} from 'next-i18next';
import React from 'react';

import Layout from '~components/Layout/Layout';
import HomepageMenu from '~components/Pages/Homepage/Menu';
import PersonBackground from '~components/Pages/Homepage/PersonBackground';
import {withTranslations} from '~utils/withTranslations';

const Index = () => {
    const {t} = useTranslation('homepage');
    return (
        <Layout seo={{title: t('title')}}>
            <PersonBackground />
            <HomepageMenu />
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({locale}) =>
    await withTranslations(locale, ['common', 'homepage']);

export default Index;
