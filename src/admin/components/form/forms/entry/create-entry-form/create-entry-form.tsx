'use client';

import React, {startTransition, useActionState, useEffect} from 'react';

import {useRouter} from 'next/navigation';

import {createEntryAction} from '@/admin/actions/create-entry-action';
import {EntryForm} from '@/admin/components/form/forms/entry-form';
import {emptyEntryTexts, EntryInput, EntryKind} from '@/types/entry';

const initialState = (kind: EntryKind): EntryInput => ({
    kind,
    slug: '',
    published: false,
    position: 100,
    featured: false,
    cover: '',
    stack: [],
    period: '',
    siteUrl: '',
    repoUrl: '',
    presentation: 'article',
    linkUrl: '',
    options: {},
    createdAt: '',
    texts: {pl: emptyEntryTexts(), en: emptyEntryTexts()},
});

type Props = {
    kind: EntryKind;
    // Values the form starts with, over the empty defaults.
    initial?: Partial<EntryInput>;
};

export function CreateEntryForm({kind, initial}: Props) {
    const [state, formAction, isPending] = useActionState(createEntryAction, {
        status: undefined,
    });

    const router = useRouter();

    useEffect(() => {
        if (state.status === 'success') {
            router.push(`/admin/entries/${state.id}`);
        }
    }, [state, router]);

    return (
        <EntryForm
            initialState={{...initialState(kind), ...initial}}
            onSubmit={(input) => startTransition(() => formAction(input))}
            isPending={isPending}
            error={state.status === 'error' ? state.error : undefined}
        />
    );
}
