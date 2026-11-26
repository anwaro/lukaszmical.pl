import {EntryRepository} from '@/services/content/repository-entry';
import {
    Entry,
    EntryKind,
    EntryKindList,
    entryExtraFields,
    entryTextFields,
} from '@/types/entry';
import {Locale, LocaleList} from '@/types/locale';

export type MediaUsage = {
    entryId: number;
    kind: EntryKind;
    slug: string;
    // 'cover', or one of the per-locale text/extra fields.
    field: string;
    locale?: Locale;
    href: string;
};

const textFields = [...entryTextFields, ...entryExtraFields];

type EntrySource = Pick<EntryRepository, 'listAll' | 'getById'>;

// Finds every entry referencing a media URL — as its cover, or literally
// (MDX images and `<Shot src="...">` are always a plain URL substring, in
// any per-locale text/extra field). Used to block deleting a used asset.
export class MediaUsageScanner {
    constructor(private repository: EntrySource = new EntryRepository()) {}

    async findUsages(url: string): Promise<MediaUsage[]> {
        const bases = (
            await Promise.all(
                EntryKindList.map((kind) => this.repository.listAll(kind)),
            )
        ).flat();

        const entries = (
            await Promise.all(bases.map((base) => this.repository.getById(base.id)))
        ).filter((entry): entry is Entry => entry !== null);

        const usages: MediaUsage[] = [];

        for (const entry of entries) {
            const href = `/admin/entries/${entry.id}`;

            if (entry.cover === url) {
                usages.push({
                    entryId: entry.id,
                    kind: entry.kind,
                    slug: entry.slug,
                    field: 'cover',
                    href,
                });
            }

            for (const locale of LocaleList) {
                const texts = entry.texts[locale];
                for (const field of textFields) {
                    if (texts[field]?.includes(url)) {
                        usages.push({
                            entryId: entry.id,
                            kind: entry.kind,
                            slug: entry.slug,
                            field,
                            locale,
                            href,
                        });
                    }
                }
            }
        }

        return usages;
    }
}
