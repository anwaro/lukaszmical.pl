import {unstable_cache} from 'next/cache';

import {Locale} from '@/types/locale';

import {loadFileMessages, MessageTree, setMessage} from './content-messages';
import {MessageRepository} from './repository-message';

// Cache tag shared by everything the CMS edits; the save action expires it.
export const CONTENT_TAG = 'cms-content';

const getCmsMessages = unstable_cache(
    () => new MessageRepository().getAll(),
    ['cms-messages'],
    {tags: [CONTENT_TAG]},
);

// File defaults overridden by what is stored in the CMS.
export async function getMessages(locale: Locale): Promise<MessageTree> {
    const messages = await loadFileMessages(locale);

    try {
        for (const row of await getCmsMessages()) {
            if (row.locale === locale) {
                setMessage(messages, `${row.namespace}.${row.key}`, row.value);
            }
        }
    } catch (error) {
        // An unreachable database must not take the whole site down — the
        // shipped defaults are still a valid set of messages.
        console.error('CMS messages unavailable, using defaults', error);
    }

    return messages;
}
