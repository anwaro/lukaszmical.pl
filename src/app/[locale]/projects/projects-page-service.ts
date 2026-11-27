import type {Metadata} from 'next';

import {listEntries} from '@/services/content/entry-store';
import {Locale} from '@/types/locale';
import {metadataForPage} from '@/utils/seo';

export class ProjectsPageService {
    async getMetadata(locale: Locale): Promise<Metadata> {
        return metadataForPage(locale, 'projects', '/projects');
    }

    async getProjects(locale: Locale) {
        return listEntries(locale, {kind: 'project'});
    }
}
