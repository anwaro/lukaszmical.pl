'use client';

import React, {useActionState, useEffect, useEffectEvent} from 'react';

import {Eye, EyeOff} from 'lucide-react';

import {EntryBase} from '@/types/entry';
import {IconButton} from '@/admin/components/button/icon-button';
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

            <IconButton
                icon={entry.published ? EyeOff : Eye}
                label={entry.published ? 'Ukryj' : 'Opublikuj'}
                tone={entry.published ? 'danger' : 'default'}
                disabled={isPending}
                loading={isPending}
                className={className}
                type={'submit'}
            />
        </form>
    );
};
