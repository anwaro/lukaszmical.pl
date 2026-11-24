'use server';

import {updateTag} from 'next/cache';

import {CONTENT_TAG} from '@/services/content/content-store';
import {messageNamespaces} from '@/services/content/content-messages';
import {MessageRepository} from '@/services/content/repository-message';
import {Locale, LocaleList} from '@/types/locale';
import {auth} from '@/utils/auth/auth';

export type ContentChanges = {
    messages: {namespace: string; key: string; locale: Locale; value: string}[];
};

export type SaveContentResult =
    | {status: undefined}
    | {status: 'error'; error: string}
    | {status: 'success'; savedAt: number};

export const saveContentAction = async (
    _prevState: SaveContentResult,
    changes: ContentChanges,
): Promise<SaveContentResult> => {
    await auth();

    const namespaces: readonly string[] = messageNamespaces;
    const messages = changes.messages.filter(
        (row) =>
            namespaces.includes(row.namespace) &&
            LocaleList.includes(row.locale) &&
            row.key,
    );

    try {
        await new MessageRepository().upsertMany(
            messages.map(({namespace, key, locale, value}) => ({
                namespace,
                key,
                locale,
                value,
            })),
        );
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
        };
    }

    // The public site reads messages through this cache tag.
    updateTag(CONTENT_TAG);

    return {status: 'success', savedAt: Date.now()};
};
