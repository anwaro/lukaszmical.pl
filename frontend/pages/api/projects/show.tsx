import {NextApiHandler} from 'next';

import ProjectModel from '~models/project';
import {queryToString} from "~utils/query";


const handler: NextApiHandler = async (req, res) => {
    const model = new ProjectModel();
    const htmlRes = await model.render(queryToString(req.query.name));
    res.setHeader('Content-Type', 'text/html');
    if (htmlRes) {
        res.status(200);
    } else {
        res.status(404);
    }
    res.send(htmlRes);
}

export default handler;
