'use server';

import {updateTag} from 'next/cache';

import {MediaService} from '@/services/media/media-service';
import {MEDIA_TAG} from '@/services/media/media-store';
import {MediaAsset} from '@/types/media';
import {auth} from '@/utils/auth/auth';

export type UploadMediaResult =
    | {status: undefined}
    | {status: 'error'; error: string}
    | {status: 'success'; asset: MediaAsset};

const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
];
const MAX_SIZE = 10 * 1024 * 1024;

export const uploadMediaAction = async (
    _prevState: UploadMediaResult,
    form: FormData,
): Promise<UploadMediaResult> => {
    await auth();
    const file = form.get('file');

    if (!(file instanceof File)) {
        return {status: 'error', error: 'Brak pliku'};
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
        return {status: 'error', error: 'Nieobsługiwany format pliku'};
    }
    if (file.size > MAX_SIZE) {
        return {status: 'error', error: 'Plik jest większy niż 10 MB'};
    }

    try {
        const asset = await new MediaService().upload(file);
        updateTag(MEDIA_TAG);
        return {status: 'success', asset};
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
        };
    }
};
