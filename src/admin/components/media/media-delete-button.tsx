'use client';

import React, {useActionState, useEffect, useEffectEvent, useState} from 'react';

import {Trash2, X} from 'lucide-react';

import {deleteMediaAction, DeleteMediaResult} from '@/admin/actions/delete-media-action';
import {IconButton} from '@/admin/components/button/icon-button';
import {useMediaLibrary} from '@/admin/media/media-library-provider';
import {MediaAsset} from '@/types/media';

type Props = {
    asset: MediaAsset;
    onResult: (result: DeleteMediaResult) => void;
};

// A two-click delete: the first click asks for confirmation, the second
// actually submits. Each tile owns its own action state, so one tile's
// pending/confirm state never affects the others.
export function MediaDeleteButton({asset, onResult}: Props) {
    const {removeAsset} = useMediaLibrary();
    const [confirming, setConfirming] = useState(false);
    const [state, formAction, isPending] = useActionState<DeleteMediaResult, FormData>(
        deleteMediaAction,
        {status: undefined},
    );

    // On success the tile is gone (removeAsset), so there's nothing left to
    // un-confirm. On blocked/error the confirm/cancel buttons just stay up —
    // the user can retry or click "Anuluj".
    const onResultEvent = useEffectEvent((result: DeleteMediaResult) => {
        if (result.status === 'success') {
            removeAsset(result.key);
        } else if (result.status === 'blocked' || result.status === 'error') {
            onResult(result);
        }
    });

    useEffect(() => {
        if (state.status) {
            onResultEvent(state);
        }
    }, [state]);

    if (confirming) {
        return (
            <>
                <form action={formAction}>
                    <input type="hidden" name="key" value={asset.key} />
                    <input type="hidden" name="url" value={asset.url} />
                    <IconButton
                        icon={Trash2}
                        label="Potwierdź usunięcie"
                        tone="danger"
                        type="submit"
                        loading={isPending}
                        disabled={isPending}
                    />
                </form>
                <IconButton
                    icon={X}
                    label="Anuluj"
                    disabled={isPending}
                    onClick={() => setConfirming(false)}
                />
            </>
        );
    }

    return (
        <IconButton icon={Trash2} label="Usuń" tone="danger" onClick={() => setConfirming(true)} />
    );
}
