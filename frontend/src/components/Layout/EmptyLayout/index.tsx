import React from 'react';

import Seo, {SeoProps} from '~components/Layout/Seo';

import styles from './styles.module.scss';

export type EmptyLayoutProps = {seo: SeoProps};

const EmptyLayout: React.FC<EmptyLayoutProps> = ({children, seo}) => (
    <>
        <Seo {...seo} />
        <main className={styles.main}>{children}</main>
    </>
);

export default EmptyLayout;
