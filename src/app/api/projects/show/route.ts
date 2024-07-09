import {ProjectRenderer} from '@/services/ProjectRenderer';

export async function GET(request: Request) {
    const project = new ProjectRenderer();
    const url = new URL(request.url);
    const name = url.pathname.replace('/projects/', '');

    const htmlResponse = await project.render(name, url);

    if (htmlResponse) {
        return new Response(htmlResponse, {
            status: 200,
            headers: new Headers({
                'content-type': 'text/html',
            }),
        });
    }

    return new Response(undefined, {status: 404});
}
