import {getProjectInfo, renderProject} from '~utils/project';

import config from '../../../config/Config';

class Project {
    public render = async (name: string) => {
        const minFile = config.NODE_ENV === 'production';
        const project = await getProjectInfo(name, minFile);
        if (project) {
            return await renderProject(project, minFile);
        }
        return undefined;
    };
}

export default Project;
