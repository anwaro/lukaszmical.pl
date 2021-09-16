import {GetStaticPaths, GetStaticProps} from 'next';
import {useTranslation} from 'next-i18next';
import React from 'react';

import PageSections from '~components/Layout/PageSections';
import {PageQuery_pages} from '~types/PageQuery';
import {queryToString} from '~utils/query';
import {withTranslations} from '~utils/withTranslations';

import {fetchPage} from '../src/api/fetchPage';
import Layout from '../src/components/Layout/Layout';

type PageProps = {
    page: PageQuery_pages;
};

const Page = ({page}: PageProps) => {
    const {t} = useTranslation('common');

    return (
        <Layout seo={{title: t('title')}}>
            <PageSections page={page} />
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({locale, params}) => {
    const slug = params?.slug;
    const page = await fetchPage(queryToString(slug));
    return await withTranslations(locale, ['common'], {page});
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true,
    };
};

export default Page;
