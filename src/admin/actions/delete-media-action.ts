'use server';

import {updateTag} from 'next/cache';

import {MediaService} from '@/services/media/media-service';
import {MEDIA_TAG} from '@/services/media/media-store';
import {MediaUsage, MediaUsageScanner} from '@/services/media/media-usage-scanner';
import {auth} from '@/utils/auth/auth';

export type DeleteMediaResult =
    | {status: undefined}
    | {status: 'blocked'; usages: MediaUsage[]}
    | {status: 'error'; error: string}
    | {status: 'success'; key: string};

// The form sends `key` (the R2 object key) and `url` (its public URL, to
// check against entries' covers and content).
export const deleteMediaAction = async (
    _prevState: DeleteMediaResult,
    form: FormData,
): Promise<DeleteMediaResult> => {
    await auth();
    const key = form.get('key');
    const url = form.get('url');

    if (typeof key !== 'string' || typeof url !== 'string' || !key || !url) {
        return {status: 'error', error: 'Nieprawidłowe żądanie'};
    }

    const usages = await new MediaUsageScanner().findUsages(url);
    if (usages.length > 0) {
        return {status: 'blocked', usages};
    }

    try {
        await new MediaService().remove(key);
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
        };
    }

    updateTag(MEDIA_TAG);
    return {status: 'success', key};
};
