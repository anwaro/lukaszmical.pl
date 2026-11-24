import {and, asc, eq, inArray, sql} from 'drizzle-orm';

import {db} from '@/services/db/db-client';
import {entries, entryTranslations} from '@/services/db/schema';
import {
    emptyEntryTexts,
    Entry,
    EntryBase,
    entryExtraFields,
    EntryInput,
    EntryKind,
    EntryListItem,
    EntryTexts,
    LocalizedEntry,
} from '@/types/entry';
import {Locale, LocaleList} from '@/types/locale';

type EntryRow = typeof entries.$inferSelect;
type TranslationRow = typeof entryTranslations.$inferSelect;

export type EntryListFilter = {
    kind: EntryKind;
    featured?: boolean;
};

// Fields the admin changes straight from a list.
export type EntryPatch = Partial<Pick<EntryBase, 'position' | 'published'>>;

// A stored cover may point at a host that is not allowed by `next/image`
// (e.g. a decommissioned `*.r2.dev` bucket URL from before the R2 migration).
// `next/image` throws synchronously at render for an unconfigured host, which
// would crash the whole page. Keep only same-origin paths and URLs on the
// configured public domain; drop everything else so the UI falls back to the
// local placeholder instead.
function normalizeCover(cover: string | null): string | null {
    if (!cover) {
        return null;
    }
    if (cover.startsWith('/')) {
        return cover;
    }
    const publicUrl = process.env.R2_BUCKET_PUBLIC_URL;
    try {
        if (publicUrl && new URL(cover).host === new URL(publicUrl).host) {
            return cover;
        }
    } catch {
        // Not a valid absolute URL — treat as absent.
    }
    return null;
}

// Bundled apps ship their cover in `public/`, so they need no stored one.
function listCover(row: EntryRow): string | null {
    const cover = normalizeCover(row.cover);
    if (cover || row.kind !== 'project' || row.presentation !== 'app') {
        return cover;
    }
    return `/projects/${row.slug}/image/cover.jpg`;
}

const toBase = (row: EntryRow): EntryBase => ({
    ...row,
    cover: normalizeCover(row.cover),
});

function toTexts(row?: Omit<TranslationRow, 'content'> & {content?: string}): EntryTexts {
    const texts = emptyEntryTexts();
    if (row) {
        texts.title = row.title;
        texts.description = row.description;
        texts.lead = row.lead;
        texts.content = row.content ?? '';
        for (const field of entryExtraFields) {
            texts[field] = row.extra[field] ?? '';
        }
    }
    return texts;
}

function toTranslation(entryId: number, locale: Locale, texts: EntryTexts) {
    return {
        entryId,
        locale,
        title: texts.title,
        description: texts.description,
        lead: texts.lead,
        content: texts.content,
        extra: Object.fromEntries(
            entryExtraFields
                .filter((field) => texts[field])
                .map((field) => [field, texts[field]]),
        ),
    };
}

// Empty optional values are stored as NULL.
function toRow({texts: _texts, createdAt, ...base}: EntryInput) {
    return {
        ...base,
        cover: base.cover || null,
        period: base.period || null,
        siteUrl: base.siteUrl || null,
        repoUrl: base.repoUrl || null,
        linkUrl: base.linkUrl || null,
        ...(createdAt ? {createdAt} : {}),
    };
}

// Access to CMS entries. The only place that knows how they are stored —
// the rest of the app works with the types from `@/types/entry`.
export class EntryRepository {
    private async withTexts(row: EntryRow | undefined): Promise<Entry | null> {
        if (!row) {
            return null;
        }

        const rows = await db
            .select()
            .from(entryTranslations)
            .where(eq(entryTranslations.entryId, row.id));

        const texts = Object.fromEntries(
            LocaleList.map((locale) => [
                locale,
                toTexts(rows.find((item) => item.locale === locale)),
            ]),
        ) as Record<Locale, EntryTexts>;

        // The admin edits the stored cover, not the normalized one.
        return {...row, texts};
    }

    async getById(id: number): Promise<Entry | null> {
        const [row] = await db.select().from(entries).where(eq(entries.id, id)).limit(1);
        return this.withTexts(row);
    }

    async getBySlug(kind: EntryKind, slug: string): Promise<Entry | null> {
        const [row] = await db
            .select()
            .from(entries)
            .where(and(eq(entries.kind, kind), eq(entries.slug, slug)))
            .limit(1);
        return this.withTexts(row);
    }

    // One entry in one language, published or not.
    async getLocalized(
        kind: EntryKind,
        slug: string,
        locale: Locale,
    ): Promise<LocalizedEntry | null> {
        const [row] = await db
            .select()
            .from(entries)
            .where(and(eq(entries.kind, kind), eq(entries.slug, slug)))
            .limit(1);

        if (!row) {
            return null;
        }

        const [translation] = await db
            .select()
            .from(entryTranslations)
            .where(
                and(
                    eq(entryTranslations.entryId, row.id),
                    eq(entryTranslations.locale, locale),
                ),
            )
            .limit(1);

        return {...toBase(row), ...toTexts(translation)};
    }

    // Every entry of a kind, drafts included — for the admin lists.
    async listAll(kind: EntryKind): Promise<EntryBase[]> {
        const rows = await db
            .select()
            .from(entries)
            .where(eq(entries.kind, kind))
            .orderBy(asc(entries.position), asc(entries.id));

        return rows.map(toBase);
    }

    // Published entries of a kind in one language, without their content.
    async list(locale: Locale, filter: EntryListFilter): Promise<EntryListItem[]> {
        const rows = await db
            .select()
            .from(entries)
            .where(
                and(
                    eq(entries.published, true),
                    eq(entries.kind, filter.kind),
                    filter.featured ? eq(entries.featured, true) : undefined,
                ),
            )
            .orderBy(asc(entries.position), asc(entries.id));

        if (!rows.length) {
            return [];
        }

        const translations = await db
            .select({
                entryId: entryTranslations.entryId,
                locale: entryTranslations.locale,
                title: entryTranslations.title,
                description: entryTranslations.description,
                lead: entryTranslations.lead,
                extra: entryTranslations.extra,
            })
            .from(entryTranslations)
            .where(
                and(
                    inArray(
                        entryTranslations.entryId,
                        rows.map((row) => row.id),
                    ),
                    eq(entryTranslations.locale, locale),
                ),
            );

        const byEntry = new Map(translations.map((item) => [item.entryId, item]));

        return rows.map((row) => {
            const {content: _content, ...texts} = toTexts(byEntry.get(row.id));
            return {...toBase(row), cover: listCover(row), ...texts};
        });
    }

    async create(input: EntryInput): Promise<number> {
        return db.transaction(async (tx) => {
            const [row] = await tx
                .insert(entries)
                .values(toRow(input))
                .returning({id: entries.id});

            await tx
                .insert(entryTranslations)
                .values(
                    LocaleList.map((locale) =>
                        toTranslation(row.id, locale, input.texts[locale]),
                    ),
                );

            return row.id;
        });
    }

    async update(id: number, input: EntryInput): Promise<void> {
        await db.transaction(async (tx) => {
            await tx
                .update(entries)
                .set({...toRow(input), updatedAt: sql`now()`})
                .where(eq(entries.id, id));

            await tx
                .insert(entryTranslations)
                .values(
                    LocaleList.map((locale) =>
                        toTranslation(id, locale, input.texts[locale]),
                    ),
                )
                .onConflictDoUpdate({
                    target: [entryTranslations.entryId, entryTranslations.locale],
                    set: {
                        title: sql`excluded.title`,
                        description: sql`excluded.description`,
                        lead: sql`excluded.lead`,
                        content: sql`excluded.content`,
                        extra: sql`excluded.extra`,
                    },
                });
        });
    }

    async patch(id: number, patch: EntryPatch): Promise<void> {
        await db
            .update(entries)
            .set({...patch, updatedAt: sql`now()`})
            .where(eq(entries.id, id));
    }
}
