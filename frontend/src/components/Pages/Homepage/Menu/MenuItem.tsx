import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

import s from './styles.module.scss';

export type MenuItemProps = {
    link: string;
    text: string;
    textOnHover: string;
    hover: boolean;
};

const MenuItem: React.FC<MenuItemProps> = ({link, text, textOnHover, hover}) => {
    return (
        <Link href={link}>
            <a className={classNames(s.menuItem, hover && s.hover)}>
                <div className={s.word}>{text}</div>
                <div className={s.hoverWord}>{textOnHover}</div>
            </a>
        </Link>
    );
};

export default MenuItem;
