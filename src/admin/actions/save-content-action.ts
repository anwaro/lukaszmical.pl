'use server';

import {updateTag} from 'next/cache';
import {z} from 'zod';

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

const contentChangesSchema = z.object({
    messages: z.array(
        z.object({
            namespace: z.string(),
            key: z.string(),
            locale: z.string(),
            value: z.string(),
        }),
    ),
});

export const saveContentAction = async (
    _prevState: SaveContentResult,
    changes: ContentChanges,
): Promise<SaveContentResult> => {
    await auth();

    const parsed = contentChangesSchema.safeParse(changes);
    if (!parsed.success) {
        return {status: 'error', error: 'Nieprawidłowe żądanie'};
    }

    const namespaces: readonly string[] = messageNamespaces;
    const messages = parsed.data.messages.filter(
        (
            row,
        ): row is {namespace: string; key: string; locale: Locale; value: string} =>
            namespaces.includes(row.namespace) &&
            LocaleList.includes(row.locale as Locale) &&
            Boolean(row.key),
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
