import {Router} from 'express';

import config from '../../../config/Config';
import {getProjectInfo, renderProject} from '../../utils/project';

class Index {
    private readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter = () => {
        this.router.get('/:slug', async (req, res) => {
            const minFile = config.NODE_ENV === 'production';
            const project = await getProjectInfo(req.params.slug, minFile);
            if (project) {
                const response = await renderProject(project, minFile);
                return res.send(response);
            }
            res.send('Not found :)');
        });

        return this.router;
    };
}

export default Index;
