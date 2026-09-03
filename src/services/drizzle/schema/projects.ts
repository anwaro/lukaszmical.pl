import {relations} from 'drizzle-orm';
import {
    bigint,
    boolean,
    pgTable,
    smallint,
    text,
    timestamp,
    unique,
} from 'drizzle-orm/pg-core';

import {projectLocale, projectStringType, projectType} from './enums';

export const projects = pgTable(
    'projects',
    {
        id: bigint('id', {mode: 'number'})
            .primaryKey()
            .generatedByDefaultAsIdentity(),
        createdAt: timestamp('createdAt', {withTimezone: true, mode: 'string'})
            .defaultNow()
            .notNull(),
        url: text('url').notNull(),
        type: projectType('type').default('project').notNull(),
        themeCss: boolean('themeCss').default(false).notNull(),
        myQuery: boolean('myQuery').default(false).notNull(),
        published: boolean('published').default(false).notNull(),
        order: smallint('order').notNull(),
        cover: text('cover'),
    },
    (table) => [unique('projects_slug_key').on(table.url)],
);

export const projectsStrings = pgTable('projects_strings', {
    id: bigint('id', {mode: 'number'})
        .primaryKey()
        .generatedByDefaultAsIdentity(),
    projectId: bigint('projectId', {mode: 'number'}).references(
        () => projects.id,
        {onDelete: 'cascade'},
    ),
    locale: projectLocale('locale').notNull(),
    type: projectStringType('type').notNull(),
    value: text('value'),
});

export const projectsRelations = relations(projects, (helpers) => ({
    strings: helpers.many(projectsStrings),
}));

export const projectsStringsRelations = relations(
    projectsStrings,
    (helpers) => ({
        project: helpers.one(projects, {
            fields: [projectsStrings.projectId],
            references: [projects.id],
        }),
    }),
);

export type Project = typeof projects.$inferSelect;
export type ProjectInsert = typeof projects.$inferInsert;
export type ProjectString = typeof projectsStrings.$inferSelect;
export type ProjectStringInsert = typeof projectsStrings.$inferInsert;
