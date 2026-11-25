import {isLoggedIn} from '@/utils/auth/auth';
import {LocalizedEntry} from '@/types/entry';

export type EntryVisibility = {
    entry: LocalizedEntry;
    // Admin edit link, set only when the visitor is logged in.
    editHref?: string;
};

// The single rule for who may see an entry: published entries are public,
// drafts are visible to the logged-in admin only (who also gets an edit link).
// Centralized here so every route renders this rule the same way — a caller
// that fetches an entry and skips this check leaves a draft public.
export async function resolveEntryVisibility(
    entry: LocalizedEntry | null,
): Promise<EntryVisibility | null> {
    if (!entry) {
        return null;
    }

    const loggedIn = await isLoggedIn();

    if (!entry.published && !loggedIn) {
        return null;
    }

    return {
        entry,
        editHref: loggedIn ? `/admin/entries/${entry.id}` : undefined,
    };
}
