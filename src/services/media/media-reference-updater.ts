import {EntryRepository} from '@/services/content/repository-entry';
import {MediaUsageScanner} from '@/services/media/media-usage-scanner';
import {Entry, EntryInput, entryExtraFields, entryTextFields} from '@/types/entry';
import {LocaleList} from '@/types/locale';

const textFields = [...entryTextFields, ...entryExtraFields];

type EntryStore = Pick<EntryRepository, 'listAll' | 'getById' | 'update'>;

// Rewrites every reference to a media URL (cover and per-locale texts) to a
// new one — run after an asset moves, so the entries keep pointing at it.
export class MediaReferenceUpdater {
    private scanner: MediaUsageScanner;

    constructor(private repository: EntryStore = new EntryRepository()) {
        this.scanner = new MediaUsageScanner(repository);
    }

    // Returns the ids of the entries that were changed.
    async replaceUrl(from: string, to: string): Promise<number[]> {
        if (from === to) {
            return [];
        }

        const usages = await this.scanner.findUsages(from);
        const ids = [...new Set(usages.map((usage) => usage.entryId))];

        for (const id of ids) {
            const entry = await this.repository.getById(id);
            if (entry) {
                await this.repository.update(id, this.rewrite(entry, from, to));
            }
        }

        return ids;
    }

    private rewrite(entry: Entry, from: string, to: string): EntryInput {
        const {
            id: _id,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...input
        } = entry;
        const texts = Object.fromEntries(
            LocaleList.map((locale) => {
                const localeTexts = {...entry.texts[locale]};
                for (const field of textFields) {
                    localeTexts[field] = localeTexts[field]?.split(from).join(to);
                }
                return [locale, localeTexts];
            }),
        ) as Entry['texts'];

        return {
            ...input,
            cover: entry.cover === from ? to : entry.cover,
            texts,
        };
    }
}
