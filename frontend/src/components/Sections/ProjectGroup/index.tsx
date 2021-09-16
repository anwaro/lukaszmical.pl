import React, {useMemo} from 'react';

import {ENUM_COMPONENTBLOCKSGROUP_TYPE} from '~types/globalTypes';
import {
    ProjectGroupEntity,
    ProjectGroupEntity_projects,
} from '~types/ProjectGroupEntity';

import PGBanner from './PGBanner';
import PGHalf from './PGHalf';
import PGList from './PGList';

export type ProjectGroupProps = {
    section: ProjectGroupEntity;
};

const ProjectGroup: React.FC<ProjectGroupProps> = ({section}) => {
    const projects = useMemo(() => {
        return (section?.projects || []).filter(
            (p): p is ProjectGroupEntity_projects => !!p,
        );
    }, [section]);

    switch (section.type) {
        case ENUM_COMPONENTBLOCKSGROUP_TYPE.banner:
            return <PGBanner projects={projects} />;
        case ENUM_COMPONENTBLOCKSGROUP_TYPE.half:
            return <PGHalf projects={projects} />;
        case ENUM_COMPONENTBLOCKSGROUP_TYPE.list:
        default:
            return <PGList projects={projects} />;
    }
};

export default ProjectGroup;
