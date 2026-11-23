import {pgEnum} from 'drizzle-orm/pg-core';

export const projectLocale = pgEnum('ProjectLocale', ['pl', 'en']);

export const projectStringType = pgEnum('ProjectStringType', [
    'name',
    'description',
    'content',
    'headline',
    'lead',
    'role',
    'problem',
    'approach',
    'result',
    'meta',
]);

export const projectType = pgEnum('ProjectType', [
    'external',
    'page',
    'project',
    'case-study',
]);
