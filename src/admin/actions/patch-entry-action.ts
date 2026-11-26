'use server';

import {z} from 'zod';

import {EntryPatch, EntryRepository} from '@/services/content/repository-entry';
import {auth} from '@/utils/auth/auth';

type State = {id: number} & EntryPatch;

const patchEntrySchema = z.object({
    id: z.coerce.number().int(),
    name: z.enum(['position', 'published']),
    value: z.string(),
});

// Changes one field of an entry from an admin list. The form sends `name`
// (`position` or `published`) and `value`.
export const patchEntryAction = async (
    prevState: State,
    form: FormData,
): Promise<State> => {
    await auth();

    const parsed = patchEntrySchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
        return prevState;
    }
    const {id, name, value} = parsed.data;

    let patch: EntryPatch;
    if (name === 'position' && Number.isInteger(Number(value))) {
        patch = {position: Number(value)};
    } else if (name === 'published') {
        patch = {published: value === '1'};
    } else {
        return prevState;
    }

    await new EntryRepository().patch(id, patch);

    return {id, ...patch};
};
