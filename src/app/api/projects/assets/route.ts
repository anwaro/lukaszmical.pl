import fs from 'fs';
import {basename} from 'path';

import mine from 'mime';

import {LocalProjectService} from '@/services/local-project-service';

import {streamFile} from './stream';

export async function GET(request: Request) {
    const project = new LocalProjectService();
    const path = project.getProjectsPath(
        new URL(request.url).pathname.replace('..', '').replace('assets/', ''),
    );

    if (fs.existsSync(path)) {
        const stats = await fs.promises.stat(path);
        const stream: ReadableStream = streamFile(path);

        return new Response(stream, {
            status: 200,
            headers: new Headers({
                'content-disposition': `attachment; filename=${basename(path)}`,
                'content-type': mine.getType(path) || 'text/plain',
                'content-length': stats.size + '',
            }),
        });
    }

    return new Response(undefined, {status: 404});
}
