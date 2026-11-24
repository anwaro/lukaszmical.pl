import {pgEnum} from 'drizzle-orm/pg-core';

export const locale = pgEnum('locale', ['pl', 'en']);

export const entryKind = pgEnum('entry_kind', ['page', 'case_study', 'project']);

export const entryPresentation = pgEnum('entry_presentation', [
    'article',
    'app',
    'link',
]);
