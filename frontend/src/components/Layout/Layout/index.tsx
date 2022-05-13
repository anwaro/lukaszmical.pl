import React from 'react';

import Seo, {SeoProps} from '~components/Layout/Seo';
import {ReactFC} from '~types/react';

import Menu from '../Menu';

import {Main} from './styles';

export type LayoutProps = {
    seo: SeoProps;
    showMenu?: boolean;
    showFooter?: boolean;
};

const Layout: ReactFC<LayoutProps> = ({children, seo, showMenu}) => (
    <>
        <Seo {...seo} />
        {showMenu && <Menu />}
        <Main>{children}</Main>
    </>
);

export default Layout;
