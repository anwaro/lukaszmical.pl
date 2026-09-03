import {pgEnum} from 'drizzle-orm/pg-core';

export const projectLocale = pgEnum('ProjectLocale', ['pl', 'en']);

export const projectStringType = pgEnum('ProjectStringType', [
    'name',
    'description',
    'content',
]);

export const projectType = pgEnum('ProjectType', [
    'external',
    'page',
    'project',
]);
