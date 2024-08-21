'use server';

import {R2Client} from '@/services/r2/r2-client';
import {auth} from '@/utils/supabase/auth';

type State = {
    url: string;
};

const fileName = (name: string) => {
    const prefix = (Math.random() + 1).toString(36).substring(7);

    return [
        prefix,
        name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\-.a-z0-9]/, ''),
    ].join('-');
};

export const uploadImage = async (
    _prevState: State,
    form: FormData,
): Promise<State> => {
    await auth();
    const r2Client = new R2Client();
    const file = form.get('file') as File;

    const key = fileName(file.name);

    const arrayBuffer = await file.arrayBuffer();
    await r2Client.upload(key, Buffer.from(arrayBuffer), file.type);

    return {
        url: `${r2Client.publicDomain()}/${key}`,
    };
};
