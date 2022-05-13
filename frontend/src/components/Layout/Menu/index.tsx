import React from 'react';
import Link from 'next/link';

import {Nav, Item, Container} from './styles';

export type LayoutProps = {
    title?: string;
};

export type MenuLinkProps = {
    href: string;
    title: string;
};

const MenuLink: React.FC<MenuLinkProps> = ({href, title}) => (
    <Link href={href}>
        <Item>{title}</Item>
    </Link>
);

const Menu: React.FC<LayoutProps> = () => (
    <Nav>
        <Container>
            <MenuLink href={'/'} title={'Home'} />
            <MenuLink href={'/about'} title={'about'} />
            <MenuLink href={'/projects'} title={'projects'} />
        </Container>
    </Nav>
);

export default Menu;
