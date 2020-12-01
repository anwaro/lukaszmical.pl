import {Router} from 'express';

import ProjectApi from './ProjectApi';

class ApiV1Controller {
    private readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter = () => {
        const projectApi = new ProjectApi();

        this.router.use('/projects', projectApi.getRouter());

        this.router.get('/', (req, res) => {
            res.send('Hello from APIv1 root route.' + req.baseUrl);
        });

        this.router.get('/projects', (req, res) => {
            res.send('List of APIv1 users.' + req.baseUrl);
        });

        return this.router;
    };
}

export default ApiV1Controller;
