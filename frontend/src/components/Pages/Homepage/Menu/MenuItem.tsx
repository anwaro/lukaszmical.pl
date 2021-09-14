import Link from 'next/link';
import React from 'react';
import {animated} from 'react-spring';

import s from './styles.module.scss';

export type MenuItemProps = {
    color: string;
    link: string;
    text: string;
    textOnHover: string;
};

const MenuItem: React.FC<MenuItemProps> = ({link, text, textOnHover, color}) => {
    return (
        <Link href={link}>
            <a className={s.menuItem}>
                <div className={s.words} style={{color}}>
                    <animated.div className={s.word}>{text}</animated.div>
                    <animated.div className={s.hoverWord}>
                        {textOnHover}
                    </animated.div>
                </div>
            </a>
        </Link>
    );
};

export default MenuItem;
