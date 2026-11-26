'use client';

import React, {useActionState, useEffect, useEffectEvent, useState} from 'react';

import {FolderInput} from 'lucide-react';

import {moveMediaAction, MoveMediaResult} from '@/admin/actions/move-media-action';
import {Button} from '@/admin/components/button/button';
import {IconButton} from '@/admin/components/button/icon-button';
import {chipClassName} from '@/admin/components/chip-class-name';
import {fieldInputClassName} from '@/admin/components/form/field-input-class-name';
import {MediaUsageList} from '@/admin/components/media/media-usage-list';
import {Modal} from '@/admin/components/modal/modal';
import {noticeDangerClassName} from '@/admin/components/notice-class-name';
import {useMediaLibrary} from '@/admin/media/media-library-provider';
import {folderOf, sanitizeFolder} from '@/services/media/media-path';
import {MediaAsset} from '@/types/media';

type Props = {
    asset: MediaAsset;
    // Every folder currently in use, for the datalist and the quick-pick chips.
    folders: string[];
};

// A small modal to pick (or type) a destination folder — on success the
// asset's key (and url) change, so the tile re-renders under the new one.
export function MediaMoveButton({asset, folders}: Props) {
    const {replaceAsset} = useMediaLibrary();
    const [open, setOpen] = useState(false);
    const [folder, setFolder] = useState(folderOf(asset.key) ?? '');
    const [state, formAction, isPending] = useActionState<MoveMediaResult, FormData>(
        moveMediaAction,
        {status: undefined},
    );

    // On success the tile's key changes, so this whole component unmounts —
    // the parent remounts a fresh one (closed) for the asset under its new
    // key. Nothing here needs to close the modal itself.
    const onResultEvent = useEffectEvent((result: MoveMediaResult) => {
        if (result.status === 'success') {
            replaceAsset(result.previousKey, result.asset);
        }
    });

    useEffect(() => {
        if (state.status === 'success') {
            onResultEvent(state);
        }
    }, [state]);

    return (
        <>
            <IconButton
                icon={FolderInput}
                label="Przenieś do folderu"
                onClick={() => {
                    setFolder(folderOf(asset.key) ?? '');
                    setOpen(true);
                }}
            />
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="Przenieś do folderu"
            >
                <form
                    action={formAction}
                    onSubmit={(event) => {
                        // Picking the folder the asset is already in: nothing
                        // to send, so close without a round trip.
                        if (sanitizeFolder(folder) === folderOf(asset.key)) {
                            event.preventDefault();
                            setOpen(false);
                        }
                    }}
                >
                    <input type="hidden" name="key" value={asset.key} />
                    <input type="hidden" name="url" value={asset.url} />
                    <input type="hidden" name="size" value={asset.size} />
                    <input
                        type="hidden"
                        name="contentType"
                        value={asset.contentType ?? ''}
                    />
                    <input
                        className={fieldInputClassName('mb-3')}
                        name="folder"
                        list={`media-folders-${asset.key}`}
                        placeholder="Katalog główny"
                        value={folder}
                        onChange={(event) => setFolder(event.target.value)}
                    />
                    <datalist id={`media-folders-${asset.key}`}>
                        {folders.map((name) => (
                            <option key={name} value={name} />
                        ))}
                    </datalist>
                    {folders.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                            {folders.map((name) => (
                                <button
                                    key={name}
                                    type="button"
                                    aria-pressed={folder === name}
                                    className={chipClassName()}
                                    onClick={() => setFolder(name)}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    )}
                    {state.status === 'blocked' && (
                        <p className={noticeDangerClassName('mb-3')}>
                            Ten plik jest używany, nie można go przenieść:{' '}
                            <MediaUsageList usages={state.usages} />
                        </p>
                    )}
                    {state.status === 'error' && (
                        <p className={noticeDangerClassName('mb-3')}>{state.error}</p>
                    )}
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            type="button"
                            disabled={isPending}
                            onClick={() => setOpen(false)}
                        >
                            Anuluj
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            loading={isPending}
                            disabled={isPending}
                        >
                            Przenieś
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
