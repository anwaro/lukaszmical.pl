import Head from 'next/head';
import React from 'react';

export type SeoProps = {
    title?: string;
};

const Seo: React.FC<SeoProps> = ({title = 'Nextjs Typescript Boilerplate'}) => (
    <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;900&display=swap"
            rel="stylesheet"
        />
    </Head>
);

export default Seo;
