'use server';

import {z} from 'zod';

import {EntryRepository} from '@/services/content/repository-entry';
import {EntryInput} from '@/types/entry';
import {entryInputSchema} from '@/types/entry-schema';
import {auth} from '@/utils/auth/auth';

type UpdateEntryResult =
    | {status: undefined}
    | {status: 'error'; error: string}
    | {status: 'success'; savedAt: number};

const updateEntrySchema = z.object({
    id: z.number().int(),
    input: entryInputSchema,
});

export const updateEntryAction = async (
    _prevState: UpdateEntryResult,
    payload: {id: number; input: EntryInput},
): Promise<UpdateEntryResult> => {
    await auth();

    const parsed = updateEntrySchema.safeParse(payload);
    if (!parsed.success) {
        return {status: 'error', error: 'Nieprawidłowe żądanie'};
    }
    const {id, input} = parsed.data;

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
