'use server';

import {updateTag} from 'next/cache';

import {CONTENT_TAG} from '@/services/content/content-store';
import {EntryRepository} from '@/services/content/repository-entry';
import {EntryInput} from '@/types/entry';
import {entryInputSchema} from '@/types/entry-schema';
import {auth} from '@/utils/auth/auth';

type CreateEntryResult =
    | {status: undefined}
    | {status: 'error'; error: string}
    | {status: 'success'; id: number};

export const createEntryAction = async (
    _prevState: CreateEntryResult,
    input: EntryInput,
): Promise<CreateEntryResult> => {
    await auth();

    const parsed = entryInputSchema.safeParse(input);
    if (!parsed.success) {
        return {status: 'error', error: 'Nieprawidłowe żądanie'};
    }

    try {
        const id = await new EntryRepository().create(parsed.data);
        updateTag(CONTENT_TAG);
        return {status: 'success', id};
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
        };
    }
};
