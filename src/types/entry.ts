import {Locale} from './locale';

// An entry is one piece of CMS content: a static page, a case study or a project.
export type EntryKind = 'page' | 'case_study' | 'project';

// How a project opens: a write-up built from blocks, an app served from
// `public/projects/<slug>`, or a link somewhere else. Pages and case studies
// are always articles.
export type EntryPresentation = 'article' | 'app' | 'link';

export const EntryKindList: EntryKind[] = ['page', 'case_study', 'project'];
export const EntryPresentationList: EntryPresentation[] = ['article', 'app', 'link'];

// Slug of the `page` entry rendered at `/`.
export const HOMEPAGE_SLUG = 'homepage';

// Switches of the legacy apps (`presentation: 'app'`).
export type EntryOptions = {
    themeCss?: boolean;
    myQuery?: boolean;
};

// The part of an entry shared by every language.
export type EntryBase = {
    id: number;
    kind: EntryKind;
    slug: string;
    published: boolean;
    position: number;
    featured: boolean;
    cover: string | null;
    stack: string[];
    period: string | null;
    siteUrl: string | null;
    repoUrl: string | null;
    presentation: EntryPresentation;
    // Target of a `link` presentation.
    linkUrl: string | null;
    options: EntryOptions;
    createdAt: string;
    updatedAt: string;
};

// Texts every kind has.
export const entryTextFields = ['title', 'description', 'lead', 'content'] as const;

// Texts only some kinds use (today: case studies); stored together as JSON.
export const entryExtraFields = [
    'headline',
    'role',
    'problem',
    'approach',
    'result',
    // "label: value" lines shown next to role, period and stack.
    'facts',
] as const;

export type EntryExtra = Record<(typeof entryExtraFields)[number], string>;
export type EntryTexts = Record<(typeof entryTextFields)[number], string> & EntryExtra;

// An entry with its texts in every language — what the admin edits.
export type Entry = EntryBase & {texts: Record<Locale, EntryTexts>};

// An entry in one language — what a page of the site renders.
export type LocalizedEntry = EntryBase & EntryTexts;

export type EntryListItem = EntryBase & Omit<EntryTexts, 'content'>;

// What the admin sends to create or update an entry. An empty `createdAt`
// means "now" on create and "unchanged" on update.
export type EntryInput = Omit<Entry, 'id' | 'createdAt' | 'updatedAt'> & {
    createdAt?: string;
};

export function emptyEntryTexts(): EntryTexts {
    return Object.fromEntries(
        [...entryTextFields, ...entryExtraFields].map((field) => [field, '']),
    ) as EntryTexts;
}
