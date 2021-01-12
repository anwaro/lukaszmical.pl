import express from 'express';
import next from 'next';

import ApiV1Controller from '../controllers/ApiV1Controller';
import PageController from '../controllers/PageController';
import Index from '../controllers/ProjectsController';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});

const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const pageController = new PageController(app);
    const projectsController = new Index();
    const apiV1Controller = new ApiV1Controller();

    server.use('/assets', express.static('projects'));

    server.use('/api/v1/', apiV1Controller.getRouter());
    server.use('/project/', projectsController.getRouter());
    server.use('/', pageController.getRouter());

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (error: Error) => {
        if (error) {
            throw error;
        }
        console.log(`> Ready on http://localhost:${port}`);
    });
});
