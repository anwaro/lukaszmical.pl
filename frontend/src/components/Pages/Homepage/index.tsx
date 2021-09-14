import React from 'react';

import BlackWrapper from '~components/Atoms/BlackWrapper';

import HomepageMenu from './Menu';
import PersonBackground from './PersonBackground';

export type HomepageProps = {};

const Homepage: React.FC<HomepageProps> = () => {
    return (
        <BlackWrapper>
            <HomepageMenu />
            <PersonBackground />
        </BlackWrapper>
    );
};

export default Homepage;
