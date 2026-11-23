'use server';

import {updateTag} from 'next/cache';

import {CONTENT_TAG, settingDefaults} from '@/services/content/content-store';
import {messageNamespaces} from '@/services/content/content-messages';
import {DrizzleSetting} from '@/services/drizzle/drizzle-setting';
import {DrizzleTranslation} from '@/services/drizzle/drizzle-translation';
import {ProjectLocale, ProjectLocalesList} from '@/types/project';
import {auth} from '@/utils/auth/auth';

export type ContentChanges = {
    messages: {namespace: string; key: string; locale: ProjectLocale; value: string}[];
    settings: {key: string; value: string}[];
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
            ProjectLocalesList.includes(row.locale) &&
            row.key,
    );
    const settings = changes.settings.filter((row) => row.key in settingDefaults);

    try {
        await new DrizzleTranslation().upsertMany(
            messages.map(({namespace, key, locale, value}) => ({
                namespace,
                key,
                locale,
                value,
            })),
        );
        await new DrizzleSetting().upsertMany(
            settings.map(({key, value}) => ({key, value})),
        );
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
        };
    }

    // The public site reads messages and settings through this cache tag.
    updateTag(CONTENT_TAG);

    return {status: 'success', savedAt: Date.now()};
};
