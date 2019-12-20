import {Router, Request, Response} from "express";
import Server from "next/dist/next-server/server/next-server";


class PageController {
    private readonly router: Router;
    private app: Server;

    constructor(app: Server) {
        this.router = Router();
        this.app = app;
    }

    public getRouter = () => {
        this.router.get('/projects/:token', this.getProject);
        return this.router;
    };

    private getProject = (req: Request, res: Response) => {
        return this.app.render(req, res, '/project')
    };
}

export default PageController;
