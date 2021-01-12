import React from 'react';

import ProjectList from '~components/Project/List';
import {projects} from '~controllers/ProjectsController/projects';

import Index from '../components/Layout/Layout';

const Projects = () => (
    <Index>
        <div>Projects</div>
        <div>
            <ProjectList projects={Object.values(projects)} />
        </div>
    </Index>
);

export default Projects;
