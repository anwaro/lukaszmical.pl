import * as React from 'react';
import Head from 'next/head';

import Menu from '../Menu';
import Footer from '../Footer';

import '../../../styles/globals.scss';
import styles from './styles.scss';

export type LayoutProps = {
    title?: string;
};

const Layout: React.FC<LayoutProps> = ({
    children,
    title = 'Nextjs Typescript Boilerplate',
}) => (
    <>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link
                rel="shortcut icon"
                href="/static/favicon.ico"
                type="image/x-icon"
            />
        </Head>
        <Menu />
        <main className={styles.main}>{children}</main>
        <Footer />
    </>
);

export default Layout;
