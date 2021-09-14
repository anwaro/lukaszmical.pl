import React from 'react';

import Seo, {SeoProps} from '~components/Layout/Seo';

import Footer from '../Footer';
import Menu from '../Menu';

import styles from './styles.module.scss';

export type LayoutProps = {
    seo: SeoProps;
};

const Layout: React.FC<LayoutProps> = ({children, seo}) => (
    <>
        <Seo {...seo} />
        <Menu />
        <main className={styles.main}>{children}</main>
        <Footer />
    </>
);

export default Layout;
