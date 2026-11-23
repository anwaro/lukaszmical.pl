import {unstable_cache} from 'next/cache';

import {DrizzleSetting} from '@/services/drizzle/drizzle-setting';
import {DrizzleTranslation} from '@/services/drizzle/drizzle-translation';
import {ProjectLocale} from '@/types/project';

import {loadFileMessages, MessageTree, setMessage} from './content-messages';

// Cache tag shared by everything the CMS edits; the save action expires it.
export const CONTENT_TAG = 'cms-content';

export const settingDefaults = {
    email: '',
    githubUrl: '',
    linkedinUrl: '',
    cvUrl: '',
    stack: 'React, Next.js, TypeScript, Postgres, Drizzle, NestJS, Laravel, Vitest',
};

export type SettingKey = keyof typeof settingDefaults;
export type SiteSettings = Record<SettingKey, string>;

const getCmsTranslations = unstable_cache(
    () => new DrizzleTranslation().getAll(),
    ['cms-translations'],
    {tags: [CONTENT_TAG]},
);

const getCmsSettings = unstable_cache(
    () => new DrizzleSetting().getAll(),
    ['cms-settings'],
    {tags: [CONTENT_TAG]},
);

// File defaults overridden by what is stored in the CMS.
export async function getMessages(locale: ProjectLocale): Promise<MessageTree> {
    const messages = await loadFileMessages(locale);

    try {
        for (const row of await getCmsTranslations()) {
            if (row.locale === locale) {
                setMessage(messages, `${row.namespace}.${row.key}`, row.value);
            }
        }
    } catch (error) {
        // An unreachable database must not take the whole site down — the
        // shipped defaults are still a valid set of messages.
        console.error('CMS translations unavailable, using defaults', error);
    }

    return messages;
}

export async function getSettings(): Promise<SiteSettings> {
    const values: SiteSettings = {...settingDefaults};

    try {
        for (const row of await getCmsSettings()) {
            if (row.key in values) {
                values[row.key as SettingKey] = row.value;
            }
        }
    } catch (error) {
        console.error('CMS settings unavailable, using defaults', error);
    }

    return values;
}

export function parseList(value: string): string[] {
    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}
