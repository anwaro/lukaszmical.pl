'use client';

import React, {startTransition, useActionState} from 'react';

import {updateEntryAction} from '@/admin/actions/update-entry-action';
import {EntryForm} from '@/admin/components/form/forms/entry-form';
import {Entry} from '@/types/entry';

type Props = {
    entry: Entry;
};

export function EditEntryForm({entry}: Props) {
    const [state, formAction, isPending] = useActionState(updateEntryAction, {
        status: undefined,
    });
    const {id, updatedAt: _updatedAt, ...initialState} = entry;

    return (
        <EntryForm
            initialState={initialState}
            onSubmit={(input) => startTransition(() => formAction({id, input}))}
            error={state.status === 'error' ? state.error : undefined}
            saved={state.status === 'success'}
            isPending={isPending}
        />
    );
}
