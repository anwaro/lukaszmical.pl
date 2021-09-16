import React from 'react';

import Banner from '~components/Sections/Banner';
import ProjectGroup from '~components/Sections/ProjectGroup';
import {PageQuery_pages_sections} from '~types/PageQuery';

export type SectionProps = {
    section: PageQuery_pages_sections;
};

const Section: React.FC<SectionProps> = ({section}) => {
    switch (section.__typename) {
        case 'ComponentBlocksBanner':
            return <Banner section={section} />;
        case 'ComponentBlocksGroup':
            return <ProjectGroup section={section} />;
        default:
            return null;
    }
};

export default Section;
