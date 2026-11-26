'use client';

import React, {startTransition, useActionState, useEffect, useEffectEvent} from 'react';

import {Upload} from 'lucide-react';

import {uploadMediaAction} from '@/admin/actions/upload-media-action';
import {Button} from '@/admin/components/button/button';
import {useMediaLibrary} from '@/admin/media/media-library-provider';
import {MediaAsset} from '@/types/media';

type Props = {
    // Called after a successful upload, in addition to adding the asset to
    // the shared library (e.g. the picker modal auto-selects it).
    onUploaded?: (asset: MediaAsset) => void;
    className?: string;
};

export function MediaUploadButton({onUploaded, className}: Props) {
    const {addAsset} = useMediaLibrary();
    const [state, formAction, isPending] = useActionState(uploadMediaAction, {
        status: undefined,
    });

    const onUploadedEvent = useEffectEvent((asset: MediaAsset) => {
        addAsset(asset);
        onUploaded?.(asset);
    });

    useEffect(() => {
        if (state.status === 'success') {
            onUploadedEvent(state.asset);
        }
    }, [state]);

    return (
        <div>
            <div className={`relative ${className ?? ''}`}>
                <Button variant="secondary" size="sm" icon={Upload} loading={isPending}>
                    Dodaj nowy
                </Button>
                <input
                    type="file"
                    aria-label="Dodaj nowy plik"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    className="absolute top-0 left-0 size-full cursor-pointer opacity-0 outline-none"
                    onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        event.currentTarget.value = '';
                        if (!file) {
                            return;
                        }
                        const form = new FormData();
                        form.append('file', file, file.name);
                        startTransition(() => formAction(form));
                    }}
                />
            </div>
            {state.status === 'error' && (
                <p className="kv-notice kv-notice-danger mt-2">{state.error}</p>
            )}
        </div>
    );
}
