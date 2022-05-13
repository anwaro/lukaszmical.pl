import {useTranslation} from 'next-i18next';
import React from 'react';

import useHoverEffect from '~components/Pages/Homepage/Menu/useHoverEffect';

import MenuItem from './MenuItem';
import {Container} from './styles';

export type HomepageMenuProps = {};

const HomepageMenu: React.FC<HomepageMenuProps> = () => {
    const {t} = useTranslation('homepage');
    const {index, ...events} = useHoverEffect(3, 2, 3);

    return (
        <Container {...events}>
            <MenuItem
                link="/about"
                text={t('hello')}
                textOnHover={t('about')}
                hover={!index}
            />
            <MenuItem
                link="/projects"
                text={t('iAm')}
                textOnHover={t('work')}
                hover={1 === index}
            />
            <MenuItem
                link="/contact"
                text={t('name')}
                textOnHover={t('contact')}
                hover={2 === index}
            />
        </Container>
    );
};

export default HomepageMenu;
