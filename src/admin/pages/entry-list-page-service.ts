import {EntryRepository} from '@/services/content/repository-entry';
import {EntryKind} from '@/types/entry';

// Shared by the admin's pages/projects/case-studies list pages: each lists
// every entry of one `EntryKind`, newest rules first.
export class EntryListPageService {
    async getEntries(kind: EntryKind) {
        return new EntryRepository().listAll(kind);
    }
}
