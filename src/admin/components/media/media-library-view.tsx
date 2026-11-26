'use client';

import React, {useState} from 'react';

import {Copy} from 'lucide-react';

import {DeleteMediaResult} from '@/admin/actions/delete-media-action';
import {IconButton} from '@/admin/components/button/icon-button';
import {MediaDeleteButton} from '@/admin/components/media/media-delete-button';
import {MediaGrid} from '@/admin/components/media/media-grid';
import {MediaUploadButton} from '@/admin/components/media/media-upload-button';
import {useMediaLibrary} from '@/admin/media/media-library-provider';

export function MediaLibraryView() {
    const {assets} = useMediaLibrary();
    const [notice, setNotice] = useState<{key: string; message: React.ReactNode} | null>(null);

    const onDeleteResult = (key: string, result: DeleteMediaResult) => {
        if (result.status === 'blocked') {
            setNotice({
                key,
                message: (
                    <>
                        Ten plik jest używany, nie można go usunąć:{' '}
                        {result.usages.map((usage, index) => (
                            <React.Fragment key={`${usage.entryId}-${usage.field}-${usage.locale ?? ''}`}>
                                {index > 0 && ', '}
                                <a href={usage.href} className="underline">
                                    {usage.slug} ({usage.field}
                                    {usage.locale ? `, ${usage.locale}` : ''})
                                </a>
                            </React.Fragment>
                        ))}
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
            {notice && <p className="kv-notice kv-notice-danger mb-4">{notice.message}</p>}
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
