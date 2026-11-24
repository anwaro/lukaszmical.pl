'use client';

import React, {useActionState, useEffect, useState, useEffectEvent} from 'react';

import {mdiCheck, mdiClose} from '@mdi/js';

import {EntryBase} from '@/types/entry';
import ButtonsGroup from '@/admin/components/button/buttons-group';
import {Button} from '@/admin/components/button/button';
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
        <form className={'flex w-50 items-center'} action={formAction}>
            <input type={'hidden'} name={'id'} value={entry.id} />
            <input type={'hidden'} name={'name'} value={'position'} />
            {isEditing ? (
                <>
                    <input
                        className="h-10 w-full max-w-full rounded border border-gray-700 bg-slate-800 px-3 py-1 placeholder:text-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-600 focus:outline-none "
                        onChange={(e) => setValue(parseInt(e.target.value))}
                        type={'number'}
                        name={'value'}
                        value={value}
                    />

                    <ButtonsGroup className={'ml-2'} noWrap>
                        <Button
                            color="info"
                            icon={mdiCheck}
                            disabled={isPending}
                            loading={isPending}
                            title={'Save position'}
                            type={'submit'}
                            small
                        />
                        <Button
                            onClick={() => setIsEditing(false)}
                            disabled={isPending}
                            color={'danger'}
                            title={'Cancel'}
                            icon={mdiClose}
                            small
                        />
                    </ButtonsGroup>
                </>
            ) : (
                <div
                    className={'flex w-50 items-center'}
                    onClick={() => setIsEditing(true)}
                >
                    {entry.position}
                </div>
            )}
        </form>
    );
};
