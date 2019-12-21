import {Router} from "express";
import {Project, projects} from "./projects";
import renderProject from "../../utils/renderProject";
// import html from "./index.html";

// const html = require("./index.html");

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
                return res.send(response)
            }
            res.send('Not found');
        });

        return this.router;
    };

    getProject = (slug: string): Project | undefined => {
        return projects.hasOwnProperty(slug) ? projects[slug] : undefined;
    }

}

export default Index;

