'use client';

import React, {useMemo, useState} from 'react';

import {Copy} from 'lucide-react';

import {DeleteMediaResult} from '@/admin/actions/delete-media-action';
import {IconButton} from '@/admin/components/button/icon-button';
import {MediaDeleteButton} from '@/admin/components/media/media-delete-button';
import {MediaGrid} from '@/admin/components/media/media-grid';
import {MediaMoveButton} from '@/admin/components/media/media-move-button';
import {MediaUploadButton} from '@/admin/components/media/media-upload-button';
import {MediaUsageList} from '@/admin/components/media/media-usage-list';
import {noticeDangerClassName} from '@/admin/components/notice-class-name';
import {useMediaLibrary} from '@/admin/media/media-library-provider';
import {distinctFolders} from '@/services/media/media-path';

export function MediaLibraryView() {
    const {assets} = useMediaLibrary();
    const folders = useMemo(() => distinctFolders(assets), [assets]);
    const [notice, setNotice] = useState<{
        key: string;
        message: React.ReactNode;
    } | null>(null);

    const onDeleteResult = (key: string, result: DeleteMediaResult) => {
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

    return (
        <div>
            <MediaUploadButton className="mb-4" />
            {notice && (
                <p className={noticeDangerClassName('mb-4')}>{notice.message}</p>
            )}
            <MediaGrid
                assets={assets}
                mode="manage"
                renderActions={(asset) => (
                    <div className="mt-2 flex gap-1">
                        <IconButton
                            icon={Copy}
                            label="Skopiuj adres"
                            onClick={() => navigator.clipboard.writeText(asset.url)}
                        />
                        <MediaMoveButton asset={asset} folders={folders} />
                        <MediaDeleteButton
                            asset={asset}
                            onResult={(result) => onDeleteResult(asset.key, result)}
                        />
                    </div>
                )}
            />
        </div>
    );
}
