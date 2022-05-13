import Link from 'next/link';
import React from 'react';

import {HoverWord, Item, Word} from './styles';

export type MenuItemProps = {
    link: string;
    text: string;
    textOnHover: string;
    hover: boolean;
};

const MenuItem: React.FC<MenuItemProps> = ({link, text, textOnHover, hover}) => {
    return (
        <Link href={link}>
            <Item hover={hover}>
                <Word>{text}</Word>
                <HoverWord>{textOnHover}</HoverWord>
            </Item>
        </Link>
    );
};

export default MenuItem;
