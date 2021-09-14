import {useTranslation} from 'next-i18next';
import React from 'react';

import MenuItem from './MenuItem';
import s from './styles.module.scss';

export type HomepageMenuProps = {};

const HomepageMenu: React.FC<HomepageMenuProps> = () => {
    const {t} = useTranslation('homepage');
    return (
        <div className={s.menu}>
            <MenuItem
                link="/about"
                text={t('hello')}
                textOnHover={t('about')}
                color={'white'}
            />
            <MenuItem
                link="/projects"
                text={t('iAm')}
                textOnHover={t('work')}
                color={'#4c6280'}
            />
            <MenuItem
                link="/contact"
                text={t('name')}
                textOnHover={t('contact')}
                color={'#4c6280'}
            />
        </div>
    );
};

export default HomepageMenu;
