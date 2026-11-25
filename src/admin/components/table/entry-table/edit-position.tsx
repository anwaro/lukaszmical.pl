'use client';

import React, {useActionState, useEffect, useState, useEffectEvent} from 'react';

import {Check, X} from 'lucide-react';

import {EntryBase} from '@/types/entry';
import {IconButton} from '@/admin/components/button/icon-button';
import {patchEntryAction} from '@/admin/actions/patch-entry-action';

type Props = {
    entry: EntryBase;
    onUpdate: (id: number, data: Partial<EntryBase>) => void;
};

export const EditPosition = ({entry, onUpdate}: Props) => {
    const [value, setValue] = useState(entry.position);
    const [isEditing, setIsEditing] = useState(false);
    const [, formAction, isPending] = useActionState(patchEntryAction, {
        id: entry.id,
        position: entry.position,
    });

    const onSettled = useEffectEvent(() => {
        onUpdate(entry.id, {position: value});
        setIsEditing(false);
    });

    useEffect(() => {
        if (!isPending) {
            // Close the editor once the server action settles (isPending
            // false); reacting to async completion is the effect's purpose.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            onSettled();
        }
    }, [isPending]);

    return (
        <form className="flex items-center justify-end gap-1" action={formAction}>
            <input type={'hidden'} name={'id'} value={entry.id} />
            <input type={'hidden'} name={'name'} value={'position'} />
            {isEditing ? (
                <>
                    <input
                        className="kv-input kv-num w-20 py-1.5 text-right"
                        onChange={(e) => setValue(parseInt(e.target.value))}
                        aria-label="Pozycja"
                        type={'number'}
                        name={'value'}
                        value={value}
                    />
                    <IconButton
                        icon={Check}
                        label="Zapisz pozycję"
                        disabled={isPending}
                        loading={isPending}
                        type={'submit'}
                    />
                    <IconButton
                        icon={X}
                        label="Anuluj"
                        onClick={() => setIsEditing(false)}
                        disabled={isPending}
                    />
                </>
            ) : (
                <button
                    type="button"
                    title="Zmień pozycję"
                    className="kv-num cursor-pointer rounded-lg px-2 py-1 hover:bg-(--surface-sunken)"
                    onClick={() => setIsEditing(true)}
                >
                    {entry.position}
                </button>
            )}
        </form>
    );
};
