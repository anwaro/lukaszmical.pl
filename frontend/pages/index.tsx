import {GetStaticProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import React from 'react';

import EmptyLayout from '~components/Layout/EmptyLayout';
import Homepage from '~components/Pages/Homepage';

const Index = () => (
    <EmptyLayout seo={{title: 'Łukasz Micał | Homepage'}}>
        <Homepage />
    </EmptyLayout>
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
