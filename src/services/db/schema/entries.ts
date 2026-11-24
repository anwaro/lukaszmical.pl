import {relations} from 'drizzle-orm';
import {
    bigint,
    boolean,
    jsonb,
    pgTable,
    primaryKey,
    smallint,
    text,
    timestamp,
    unique,
} from 'drizzle-orm/pg-core';

import {EntryExtra, EntryOptions} from '@/types/entry';

import {entryKind, entryPresentation, locale} from './enums';

const timestamptz = (name: string) =>
    timestamp(name, {withTimezone: true, mode: 'string'}).defaultNow().notNull();

// One row per piece of content: a static page, a case study or a project.
export const entries = pgTable(
    'entries',
    {
        id: bigint('id', {mode: 'number'}).primaryKey().generatedByDefaultAsIdentity(),
        kind: entryKind('kind').notNull(),
        slug: text('slug').notNull(),
        published: boolean('published').default(false).notNull(),
        position: smallint('position').default(100).notNull(),
        featured: boolean('featured').default(false).notNull(),
        cover: text('cover'),
        stack: text('stack').array().default([]).notNull(),
        period: text('period'),
        siteUrl: text('site_url'),
        repoUrl: text('repo_url'),
        presentation: entryPresentation('presentation').default('article').notNull(),
        linkUrl: text('link_url'),
        options: jsonb('options').$type<EntryOptions>().default({}).notNull(),
        createdAt: timestamptz('created_at'),
        updatedAt: timestamptz('updated_at'),
    },
    (table) => [unique('entries_kind_slug_key').on(table.kind, table.slug)],
);

// Texts of an entry, one row per language. `extra` holds the fields only some
// kinds use, so adding one does not change the schema.
export const entryTranslations = pgTable(
    'entry_translations',
    {
        entryId: bigint('entry_id', {mode: 'number'})
            .notNull()
            .references(() => entries.id, {onDelete: 'cascade'}),
        locale: locale('locale').notNull(),
        title: text('title').default('').notNull(),
        description: text('description').default('').notNull(),
        lead: text('lead').default('').notNull(),
        // MDX built from the block library.
        content: text('content').default('').notNull(),
        extra: jsonb('extra').$type<Partial<EntryExtra>>().default({}).notNull(),
    },
    (table) => [primaryKey({columns: [table.entryId, table.locale]})],
);

export const entriesRelations = relations(entries, (helpers) => ({
    translations: helpers.many(entryTranslations),
}));

export const entryTranslationsRelations = relations(entryTranslations, (helpers) => ({
    entry: helpers.one(entries, {
        fields: [entryTranslations.entryId],
        references: [entries.id],
    }),
}));
