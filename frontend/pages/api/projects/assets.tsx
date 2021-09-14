import fs from 'fs';

import {getType} from 'mime';
import {NextApiHandler} from 'next';

import {getProjectsPath} from "~utils/project";
import {queryToString} from "~utils/query";


const handler: NextApiHandler = async (req, res) => {
    const path = getProjectsPath(queryToString(req.query.path, '/').replace('..', ''));
    if (fs.existsSync(path)) {
        res.status(200);
        res.setHeader('Contant-Type', getType(path) || 'text/plain')
        fs.createReadStream(path).pipe(res);
        return
    } else {
        res.status(404);
        res.send('');
    }


}

export default handler;
