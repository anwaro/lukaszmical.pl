'use server';

import {updateTag} from 'next/cache';
import {z} from 'zod';

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

const uploadMediaSchema = z.object({
    file: z
        .instanceof(File, {message: 'Brak pliku'})
        .refine((file) => ALLOWED_TYPES.includes(file.type), {
            message: 'Nieobsługiwany format pliku',
        })
        .refine((file) => file.size <= MAX_SIZE, {
            message: 'Plik jest większy niż 10 MB',
        }),
});

export const uploadMediaAction = async (
    _prevState: UploadMediaResult,
    form: FormData,
): Promise<UploadMediaResult> => {
    await auth();

    const parsed = uploadMediaSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
        return {
            status: 'error',
            error: parsed.error.issues[0]?.message ?? 'Nieprawidłowe żądanie',
        };
    }
    const {file} = parsed.data;

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
