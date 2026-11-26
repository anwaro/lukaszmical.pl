import type {Metadata} from 'next';

import {EntryRepository} from '@/services/content/repository-entry';
import {Locale} from '@/types/locale';
import {metadataForPage} from '@/utils/seo';

export class CaseStudiesPageService {
    async getMetadata(locale: Locale): Promise<Metadata> {
        return metadataForPage(locale, 'caseStudies', '/case-studies');
    }

    async getCaseStudies(locale: Locale) {
        return new EntryRepository().list(locale, {kind: 'case_study'});
    }
}
