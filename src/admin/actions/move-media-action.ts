'use server';

import {updateTag} from 'next/cache';

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

// The form sends the asset's own fields (so the service never has to
// re-fetch its metadata) plus the target `folder` — empty for the root.
export const moveMediaAction = async (
    _prevState: MoveMediaResult,
    form: FormData,
): Promise<MoveMediaResult> => {
    await auth();
    const key = form.get('key');
    const url = form.get('url');
    const size = form.get('size');
    const contentType = form.get('contentType');
    const folder = form.get('folder');

    if (
        typeof key !== 'string' ||
        typeof url !== 'string' ||
        typeof size !== 'string' ||
        typeof folder !== 'string' ||
        !key ||
        !url
    ) {
        return {status: 'error', error: 'Nieprawidłowe żądanie'};
    }

    const usages = await new MediaUsageScanner().findUsages(url);
    if (usages.length > 0) {
        return {status: 'blocked', usages};
    }

    try {
        const asset = await new MediaService().move(
            {
                key,
                size: Number(size),
                contentType:
                    typeof contentType === 'string' && contentType
                        ? contentType
                        : undefined,
            },
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
