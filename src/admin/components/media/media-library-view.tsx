'use client';

import React, {useMemo, useState} from 'react';

import {DeleteMediaResult} from '@/admin/actions/delete-media-action';
import {moveMediaAction, MoveMediaResult} from '@/admin/actions/move-media-action';
import {MediaDeleteButton} from '@/admin/components/media/media-delete-button';
import {MediaGrid} from '@/admin/components/media/media-grid';
import {MediaMoveButton} from '@/admin/components/media/media-move-button';
import {MediaUploadButton} from '@/admin/components/media/media-upload-button';
import {MediaUsageList} from '@/admin/components/media/media-usage-list';
import {noticeDangerClassName} from '@/admin/components/notice-class-name';
import {useMediaLibrary} from '@/admin/media/media-library-provider';
import {distinctFolders} from '@/services/media/media-path';
import {MediaAsset} from '@/types/media';

export function MediaLibraryView() {
    const {assets, replaceAsset} = useMediaLibrary();
    const folders = useMemo(() => distinctFolders(assets), [assets]);
    const [notice, setNotice] = useState<{
        key: string;
        message: React.ReactNode;
    } | null>(null);

    const onActionResult = (
        key: string,
        result: DeleteMediaResult | MoveMediaResult,
    ) => {
        if (result.status === 'blocked') {
            setNotice({
                key,
                message: (
                    <>
                        Ten plik jest używany, nie można go usunąć:{' '}
                        <MediaUsageList usages={result.usages} />
                    </>
                ),
            });
        } else if (result.status === 'error') {
            setNotice({key, message: result.error});
        }
    };

    // Dragging a tile onto a folder (or the back-to-root breadcrumb) moves
    // it there directly — the move modal is for picking a folder by hand.
    const onMoveAsset = async (asset: MediaAsset, folder: string | null) => {
        const form = new FormData();
        form.append('key', asset.key);
        form.append('url', asset.url);
        form.append('size', String(asset.size));
        form.append('contentType', asset.contentType ?? '');
        form.append('folder', folder ?? '');
        const result = await moveMediaAction({status: undefined}, form);
        if (result.status === 'success') {
            replaceAsset(result.previousKey, result.asset);
        } else {
            onActionResult(asset.key, result);
        }
    };

    return (
        <div>
            <MediaUploadButton className="mb-4" />
            {notice && (
                <p className={noticeDangerClassName('mb-4')}>{notice.message}</p>
            )}
            <MediaGrid
                assets={assets}
                mode="manage"
                onMoveAsset={onMoveAsset}
                renderActions={(asset) => (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                        <MediaMoveButton asset={asset} folders={folders} />
                        <MediaDeleteButton
                            asset={asset}
                            onResult={(result) => onActionResult(asset.key, result)}
                        />
                    </div>
                )}
            />
        </div>
    );
}
