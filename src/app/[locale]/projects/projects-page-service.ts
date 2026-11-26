import type {Metadata} from 'next';

import {EntryRepository} from '@/services/content/repository-entry';
import {Locale} from '@/types/locale';
import {metadataForPage} from '@/utils/seo';

export class ProjectsPageService {
    async getMetadata(locale: Locale): Promise<Metadata> {
        return metadataForPage(locale, 'projects', '/projects');
    }

    async getProjects(locale: Locale) {
        return new EntryRepository().list(locale, {kind: 'project'});
    }
}
