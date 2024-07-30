import React from 'react';

import {LocalizedProjectEntity} from '@/types/supabase/projects';

type Props = {
    project: LocalizedProjectEntity;
};

export function ProjectPage({project}: Props) {
    return <div>{project.name}</div>;
}
