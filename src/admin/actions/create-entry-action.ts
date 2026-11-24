'use server';

import {EntryRepository} from '@/services/content/repository-entry';
import {EntryInput} from '@/types/entry';
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

    try {
        return {status: 'success', id: await new EntryRepository().create(input)};
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
        };
    }
};
