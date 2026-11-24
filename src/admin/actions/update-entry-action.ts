'use server';

import {EntryRepository} from '@/services/content/repository-entry';
import {EntryInput} from '@/types/entry';
import {auth} from '@/utils/auth/auth';

type UpdateEntryResult =
    | {status: undefined}
    | {status: 'error'; error: string}
    | {status: 'success'; savedAt: number};

export const updateEntryAction = async (
    _prevState: UpdateEntryResult,
    {id, input}: {id: number; input: EntryInput},
): Promise<UpdateEntryResult> => {
    await auth();

    try {
        await new EntryRepository().update(id, input);
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
        };
    }

    return {status: 'success', savedAt: Date.now()};
};
