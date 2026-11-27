'use client';

import React, {useActionState, useEffect, useEffectEvent, useState} from 'react';

import {Trash2} from 'lucide-react';

import {deleteMediaAction, DeleteMediaResult} from '@/admin/actions/delete-media-action';
import {Button} from '@/admin/components/button/button';
import {IconButton} from '@/admin/components/button/icon-button';
import {Modal} from '@/admin/components/modal/modal';
import {useMediaLibrary} from '@/admin/media/media-library-provider';
import {MediaAsset} from '@/types/media';

type Props = {
    asset: MediaAsset;
    onResult: (result: DeleteMediaResult) => void;
};

// Confirmation goes through a modal, like the move button's — a tile is too
// narrow to fit an inline confirm/cancel pair.
export function MediaDeleteButton({asset, onResult}: Props) {
    const {removeAsset} = useMediaLibrary();
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState<DeleteMediaResult, FormData>(
        deleteMediaAction,
        {status: undefined},
    );

    // On success the tile is gone (removeAsset), so the modal unmounts with
    // it. On blocked/error the modal just stays up — the user can retry or
    // click "Anuluj".
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

    return (
        <>
            <IconButton
                icon={Trash2}
                label="Usuń"
                tone="danger"
                onClick={() => setOpen(true)}
            />
            <Modal open={open} onClose={() => setOpen(false)} title="Usunąć plik?">
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                    Plik <span className="font-medium">{asset.key}</span> zostanie
                    trwale usunięty z zasobnika. Tej operacji nie można cofnąć.
                </p>
                <form action={formAction} className="flex justify-end gap-2">
                    <input type="hidden" name="key" value={asset.key} />
                    <input type="hidden" name="url" value={asset.url} />
                    <Button
                        variant="secondary"
                        type="button"
                        disabled={isPending}
                        onClick={() => setOpen(false)}
                    >
                        Anuluj
                    </Button>
                    <Button
                        variant="danger"
                        type="submit"
                        loading={isPending}
                        disabled={isPending}
                    >
                        Usuń
                    </Button>
                </form>
            </Modal>
        </>
    );
}
