'use client';

import React from 'react';

import {Modal} from '@/admin/components/modal/modal';
import {MediaGrid} from '@/admin/components/media/media-grid';
import {MediaUploadButton} from '@/admin/components/media/media-upload-button';
import {useMediaLibrary} from '@/admin/media/media-library-provider';
import {MediaAsset} from '@/types/media';

type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (asset: MediaAsset) => void;
};

// A gallery of the whole media library: pick an existing asset, or upload a
// new one — it's selected and the modal closes as soon as it's ready.
export function MediaPickerModal({open, onClose, onSelect}: Props) {
    const {assets} = useMediaLibrary();

    const select = (asset: MediaAsset) => {
        onSelect(asset);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title="Biblioteka mediów" size="lg">
            <MediaUploadButton className="mb-4" onUploaded={select} />
            <MediaGrid assets={assets} mode="pick" onSelect={select} />
        </Modal>
    );
}
