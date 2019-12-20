import {Router, Request, Response} from "express";

class ApiV1Controller {
    private readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter = () => {
        this.router.use((req, _res, next) => {
            console.log("mid", req.baseUrl);
            next();
        });

        this.router.get('/', (req, res) => {
            res.send('Hello from APIv1 root route.' + req.baseUrl);
        });

        this.router.get('/users', (req, res) => {
            res.send('List of APIv1 users.' + req.baseUrl);
        });

        this.router.get('/test', this.getTest);

        return this.router;
    };

    private getTest = (req: Request, res: Response) => {
        res.send(' APIv1 test.' + req.baseUrl);
    };
}

export default ApiV1Controller;

