import {Router} from 'express';

import renderProject from '../../utils/renderProject';

import {Project, projects} from './projects';

class Index {
    private readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter = () => {
        this.router.get('/:slug', async (req, res) => {
            const project = this.getProject(req.params.slug);
            if (project) {
                const response = await renderProject(project);
                return res.send(response);
            }
            res.send('Not found');
        });

        return this.router;
    };

    getProject = (slug: string): Project | undefined => {
        return projects.find((p) => p.slug === slug);
    };
}

export default Index;
