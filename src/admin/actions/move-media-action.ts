'use server';

import {updateTag} from 'next/cache';
import {z} from 'zod';

import {sanitizeFolder} from '@/services/media/media-path';
import {MediaService} from '@/services/media/media-service';
import {MEDIA_TAG} from '@/services/media/media-store';
import {MediaUsage, MediaUsageScanner} from '@/services/media/media-usage-scanner';
import {MediaAsset} from '@/types/media';
import {auth} from '@/utils/auth/auth';

export type MoveMediaResult =
    | {status: undefined}
    | {status: 'blocked'; usages: MediaUsage[]}
    | {status: 'error'; error: string}
    | {status: 'success'; previousKey: string; asset: MediaAsset};

const moveMediaSchema = z.object({
    key: z.string().min(1),
    url: z.string().min(1),
    size: z.coerce.number(),
    contentType: z
        .string()
        .optional()
        .transform((value) => (value ? value : undefined)),
    folder: z.string(),
});

// The form sends the asset's own fields (so the service never has to
// re-fetch its metadata) plus the target `folder` — empty for the root.
export const moveMediaAction = async (
    _prevState: MoveMediaResult,
    form: FormData,
): Promise<MoveMediaResult> => {
    await auth();

    const parsed = moveMediaSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
        return {status: 'error', error: 'Nieprawidłowe żądanie'};
    }
    const {key, url, size, contentType, folder} = parsed.data;

    const usages = await new MediaUsageScanner().findUsages(url);
    if (usages.length > 0) {
        return {status: 'blocked', usages};
    }

    try {
        const asset = await new MediaService().move(
            {key, size, contentType},
            sanitizeFolder(folder),
        );
        updateTag(MEDIA_TAG);
        return {status: 'success', previousKey: key, asset};
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
        };
    }
};
