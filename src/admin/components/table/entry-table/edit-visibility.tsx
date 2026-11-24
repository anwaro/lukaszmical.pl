'use client';

import React, {useActionState, useEffect, useEffectEvent} from 'react';

import {mdiEye, mdiEyeOff} from '@mdi/js';

import {EntryBase} from '@/types/entry';
import {Button} from '@/admin/components/button/button';
import {patchEntryAction} from '@/admin/actions/patch-entry-action';

type Props = {
    entry: EntryBase;
    onUpdate: (id: number, data: Partial<EntryBase>) => void;
    className?: string;
};

const FormBoolean = {
    toBoolean: (value: string | boolean | undefined) => {
        if (typeof value === 'string') {
            return value === '1';
        }
        return Boolean(value);
    },
    toFormValue: (value: string | boolean | undefined) => {
        if (typeof value !== 'string') {
            return value ? '1' : '0';
        }
        return value;
    },
};

export const EditVisibility = ({entry, className, onUpdate}: Props) => {
    const [state, formAction, isPending] = useActionState(patchEntryAction, {
        id: entry.id,
        published: entry.published,
    });

    const onPublishedChange = useEffectEvent((published: boolean) => {
        onUpdate(entry.id, {published});
    });

    useEffect(() => {
        onPublishedChange(FormBoolean.toBoolean(state.published));
    }, [state.published]);

    return (
        <form action={formAction}>
            <input type={'hidden'} name={'id'} value={entry.id} />
            <input type={'hidden'} name={'name'} value={'published'} />
            <input
                type={'hidden'}
                name={'value'}
                value={FormBoolean.toFormValue(!entry.published)}
            />

            <Button
                color={entry.published ? 'danger' : 'success'}
                title={entry.published ? 'Unpublish' : 'Publish'}
                icon={entry.published ? mdiEyeOff : mdiEye}
                disabled={isPending}
                loading={isPending}
                className={className}
                type={'submit'}
                small
            />
        </form>
    );
};
