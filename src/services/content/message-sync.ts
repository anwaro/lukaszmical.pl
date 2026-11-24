import {Locale} from '@/types/locale';

import {flattenMessages, MessageTree} from './content-messages';
import {MessageId, StoredMessage} from './repository-message';

// {common: {nav: {about: 'x'}}} -> [{namespace: 'common', key: 'nav.about', ...}]
export function messageRows(locale: Locale, tree: MessageTree): StoredMessage[] {
    return Object.entries(tree).flatMap(([namespace, messages]) =>
        typeof messages === 'string'
            ? []
            : Object.entries(flattenMessages(messages)).map(([key, value]) => ({
                  namespace,
                  key,
                  locale,
                  value,
              })),
    );
}

export type MessageSyncPlan = {
    // Required by the files, not stored yet — added with the file value.
    missing: StoredMessage[];
    // Stored, no longer in the files — removed.
    obsolete: MessageId[];
};

const idOf = (row: MessageId) => `${row.locale}\n${row.namespace}\n${row.key}`;

// The message files say which keys exist; the database holds their values.
// Stored values are never changed here — editors own them.
export function planMessageSync(
    required: StoredMessage[],
    stored: MessageId[],
): MessageSyncPlan {
    const requiredIds = new Set(required.map(idOf));
    const storedIds = new Set(stored.map(idOf));

    return {
        missing: required.filter((row) => !storedIds.has(idOf(row))),
        obsolete: stored
            .filter((row) => !requiredIds.has(idOf(row)))
            .map(({namespace, key, locale}) => ({namespace, key, locale})),
    };
}
