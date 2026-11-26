import {EntryRepository} from '@/services/content/repository-entry';
import {HOMEPAGE_SLUG} from '@/types/entry';

export class HomepageAdminPageService {
    // The homepage is a `page` entry with a reserved slug; the site has no
    // homepage until it is created here.
    async getHomepage() {
        return new EntryRepository().getBySlug('page', HOMEPAGE_SLUG);
    }
}
