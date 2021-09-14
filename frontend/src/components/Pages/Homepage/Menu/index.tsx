import {useTranslation} from 'next-i18next';
import React from 'react';

import MenuItem from './MenuItem';
import s from './styles.module.scss';

export type HomepageMenuProps = {};

const HomepageMenu: React.FC<HomepageMenuProps> = () => {
    const {t, ready} = useTranslation('homepage');
    console.log(t, ready);
    return (
        <div className={s.menu}>
            <MenuItem
                link="/about"
                text={t('hello')}
                textOnHover={t('about')}
                color={'white'}
            />
            <MenuItem
                link="/work"
                text={t('iAm')}
                textOnHover={t('work')}
                color={'red'}
            />
            <MenuItem
                link="/contact"
                text={t('name')}
                textOnHover={t('contact')}
                color={'red'}
            />
        </div>
    );
};

export default HomepageMenu;
