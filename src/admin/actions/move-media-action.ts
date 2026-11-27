'use server';

import {updateTag} from 'next/cache';
import {z} from 'zod';

import {CONTENT_TAG} from '@/services/content/content-store';
import {sanitizeFolder} from '@/services/media/media-path';
import {MediaReferenceUpdater} from '@/services/media/media-reference-updater';
import {MediaService} from '@/services/media/media-service';
import {MEDIA_TAG} from '@/services/media/media-store';
import {MediaAsset} from '@/types/media';
import {auth} from '@/utils/auth/auth';

export type MoveMediaResult =
    | {status: undefined}
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
// A used asset is moved all the same: its references in the entries are
// rewritten to the new url.
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

    try {
        const asset = await new MediaService().move(
            {key, size, contentType},
            sanitizeFolder(folder),
        );
        await new MediaReferenceUpdater().replaceUrl(url, asset.url);
        updateTag(MEDIA_TAG);
        // Entries that referenced the old URL were rewritten.
        updateTag(CONTENT_TAG);
        return {status: 'success', previousKey: key, asset};
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
        };
    }
};
