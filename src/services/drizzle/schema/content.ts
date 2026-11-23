import {bigint, pgTable, text, unique} from 'drizzle-orm/pg-core';

import {projectLocale} from './enums';

// UI strings of the public site (next-intl messages), editable in the admin.
// `key` is a dotted path inside the namespace, e.g. `hero.lead`.
export const translations = pgTable(
    'translations',
    {
        id: bigint('id', {mode: 'number'})
            .primaryKey()
            .generatedByDefaultAsIdentity(),
        namespace: text('namespace').notNull(),
        key: text('key').notNull(),
        locale: projectLocale('locale').notNull(),
        value: text('value').notNull(),
    },
    (table) => [
        unique('translations_namespace_key_locale_key').on(
            table.namespace,
            table.key,
            table.locale,
        ),
    ],
);

// Non-localized site values (e-mail, profile links, stack list).
export const settings = pgTable('settings', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
});

export type Translation = typeof translations.$inferSelect;
export type TranslationInsert = typeof translations.$inferInsert;
export type Setting = typeof settings.$inferSelect;
