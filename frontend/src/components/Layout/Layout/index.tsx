import React from 'react';

import Seo, {SeoProps} from '~components/Layout/Seo';

import Footer from '../Footer';
import Menu from '../Menu';

import styles from './styles.module.scss';

export type LayoutProps = {
    seo: SeoProps;
    showMenu?: boolean;
    showFooter?: boolean;
};

const Layout: React.FC<LayoutProps> = ({children, seo, showFooter, showMenu}) => (
    <>
        <Seo {...seo} />
        {showMenu && <Menu />}
        <main className={styles.main}>{children}</main>
        {showFooter && <Footer />}
    </>
);

export default Layout;
