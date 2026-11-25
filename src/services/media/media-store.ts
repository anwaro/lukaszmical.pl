import {unstable_cache} from 'next/cache';

import {MediaService} from '@/services/media/media-service';
import {MediaAsset} from '@/types/media';

// Cache tag for the media library; the upload/delete actions expire it.
// Safe to cache aggressively: only this admin's own actions touch the bucket.
export const MEDIA_TAG = 'media-library';

const getCachedMediaAssets = unstable_cache(
    () => new MediaService().list(),
    ['media-assets'],
    {tags: [MEDIA_TAG]},
);

export async function getMediaAssets(): Promise<MediaAsset[]> {
    return getCachedMediaAssets();
}
