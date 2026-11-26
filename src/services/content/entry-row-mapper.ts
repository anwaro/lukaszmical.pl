import {entries, entryTranslations} from '@/services/db/schema';
import {
    emptyEntryTexts,
    EntryBase,
    entryExtraFields,
    EntryInput,
    EntryTexts,
} from '@/types/entry';
import {Locale} from '@/types/locale';

export type EntryRow = typeof entries.$inferSelect;
export type TranslationRow = typeof entryTranslations.$inferSelect;

// A stored cover may point at a host that is not allowed by `next/image`
// (e.g. a decommissioned `*.r2.dev` bucket URL from before the R2 migration).
// `next/image` throws synchronously at render for an unconfigured host, which
// would crash the whole page. Keep only same-origin paths and URLs on the
// configured public domain; drop everything else so the UI falls back to the
// local placeholder instead.
export function normalizeCover(cover: string | null): string | null {
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
export function listCover(row: EntryRow): string | null {
    const cover = normalizeCover(row.cover);
    if (cover || row.kind !== 'project' || row.presentation !== 'app') {
        return cover;
    }
    return `/projects/${row.slug}/image/cover.jpg`;
}

export const toBase = (row: EntryRow): EntryBase => ({
    ...row,
    cover: normalizeCover(row.cover),
});

export function toTexts(
    row?: Omit<TranslationRow, 'content'> & {content?: string},
): EntryTexts {
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

export function toTranslation(entryId: number, locale: Locale, texts: EntryTexts) {
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
export function toRow({texts: _texts, createdAt, ...base}: EntryInput) {
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
