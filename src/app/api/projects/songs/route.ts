import {songs} from '@/app/api/projects/songs/songs';

export async function GET() {
    return Response.json(songs);
}
