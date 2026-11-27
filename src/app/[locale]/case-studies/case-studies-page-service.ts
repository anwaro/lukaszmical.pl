import type {Metadata} from 'next';

import {listEntries} from '@/services/content/entry-store';
import {Locale} from '@/types/locale';
import {metadataForPage} from '@/utils/seo';

export class CaseStudiesPageService {
    async getMetadata(locale: Locale): Promise<Metadata> {
        return metadataForPage(locale, 'caseStudies', '/case-studies');
    }

    async getCaseStudies(locale: Locale) {
        return listEntries(locale, {kind: 'case_study'});
    }
}
