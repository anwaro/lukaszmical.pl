import {ProjectRenderer} from '@/services/ProjectRenderer';
import {params} from '@/app/api/projects/show/params';

export async function GET(request: Request) {
    const project = new ProjectRenderer();
    const url = new URL(request.url);
    const {slug, minFile} = params(url);

    if (!slug) {
        return new Response(undefined, {status: 404});
    }

    const html = await project.render(slug, url, minFile);

    if (html) {
        return new Response(html, {
            status: 200,
            headers: new Headers({
                'content-type': 'text/html',
            }),
        });
    }

    return new Response(undefined, {status: 404});
}
