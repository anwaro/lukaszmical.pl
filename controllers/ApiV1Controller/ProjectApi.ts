import {Router} from "express";

class ProjectApi {
    private readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter = () => {

        this.router.get('/random-word', (_req, res) => {
            res.send('Hello');
        });

        return this.router;
    };

}

export default ProjectApi;

