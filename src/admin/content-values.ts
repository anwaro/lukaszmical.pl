import {flattenMessages, FlatMessages} from '@/services/content/content-messages';
import {getMessages, getSettings} from '@/services/content/content-store';
import {ProjectLocale} from '@/types/project';

// Current values for the content editors: CMS entries over file defaults.
export async function loadContentValues(): Promise<{
    messages: Record<ProjectLocale, FlatMessages>;
    settings: Record<string, string>;
}> {
    const [pl, en, settings] = await Promise.all([
        getMessages('pl'),
        getMessages('en'),
        getSettings(),
    ]);

    return {
        messages: {pl: flattenMessages(pl), en: flattenMessages(en)},
        settings,
    };
}
