import React from 'react';
import Link from 'next/link';

import styles from './styles.module.scss';

export type LayoutProps = {
    title?: string;
};

export type MenuLinkProps = {
    href: string;
    title: string;
};

const MenuLink: React.FC<MenuLinkProps> = ({href, title}) => (
    <Link href={href}>
        <a className={styles.navItem}>{title}</a>
    </Link>
);

const Menu: React.FC<LayoutProps> = () => (
    <nav className={styles.nav}>
        <div className={styles.navContainer}>
            <MenuLink href={'/'} title={'Home'} />
            <MenuLink href={'/about'} title={'about'} />
            <MenuLink href={'/projects'} title={'projects'} />
        </div>
    </nav>
);

export default Menu;
