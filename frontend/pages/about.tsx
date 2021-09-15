import {GetStaticProps} from 'next';
import {useTranslation} from 'next-i18next';
import React from 'react';

import PageTitle from '~components/Atoms/PageTitle';
import Layout from '~components/Layout/Layout';
import {withTranslations} from '~utils/withTranslations';

const About = () => {
    const {t} = useTranslation('about');
    return (
        <Layout seo={{title: t('title')}}>
            <PageTitle>{t('wip')}</PageTitle>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({locale}) =>
    await withTranslations(locale, ['common', 'about']);

export default About;
