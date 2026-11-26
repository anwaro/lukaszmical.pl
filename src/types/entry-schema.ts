import {z} from 'zod';

import {
    EntryKind,
    EntryKindList,
    EntryPresentation,
    EntryPresentationList,
} from './entry';

// Mirrors `EntryTexts`: the fields every kind has, plus the extra fields
// only some kinds use, all stored as plain strings.
const entryTextsSchema = z.object({
    title: z.string(),
    description: z.string(),
    lead: z.string(),
    content: z.string(),
    headline: z.string(),
    role: z.string(),
    problem: z.string(),
    approach: z.string(),
    result: z.string(),
    facts: z.string(),
});

const entryOptionsSchema = z.object({
    themeCss: z.boolean().optional(),
    myQuery: z.boolean().optional(),
});

// Mirrors `EntryInput` — what the admin's create/update entry actions
// receive from the client.
export const entryInputSchema = z.object({
    kind: z.enum(EntryKindList as [EntryKind, ...EntryKind[]]),
    slug: z.string().min(1),
    published: z.boolean(),
    position: z.number(),
    featured: z.boolean(),
    cover: z.string().nullable(),
    stack: z.array(z.string()),
    period: z.string().nullable(),
    siteUrl: z.string().nullable(),
    repoUrl: z.string().nullable(),
    presentation: z.enum(
        EntryPresentationList as [EntryPresentation, ...EntryPresentation[]],
    ),
    linkUrl: z.string().nullable(),
    options: entryOptionsSchema,
    createdAt: z.string().optional(),
    texts: z.object({
        pl: entryTextsSchema,
        en: entryTextsSchema,
    }),
});
