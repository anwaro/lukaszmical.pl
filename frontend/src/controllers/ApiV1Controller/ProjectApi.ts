import {Router} from 'express';

class ProjectApi {
    private readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter = () => {
        this.router.get('/random-word', (_req, res) => {
            const randWords = ['Hello', 'World', 'TypeScript'];
            res.send(randWords[Math.floor(Math.random() * randWords.length)]);
        });

        return this.router;
    };
}

export default ProjectApi;
