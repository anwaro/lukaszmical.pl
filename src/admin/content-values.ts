import {flattenMessages, FlatMessages} from '@/services/content/content-messages';
import {getMessages} from '@/services/content/content-store';
import {Locale} from '@/types/locale';

// Current values for the content editors: CMS entries over file defaults.
export async function loadContentValues(): Promise<{
    messages: Record<Locale, FlatMessages>;
}> {
    const [pl, en] = await Promise.all([getMessages('pl'), getMessages('en')]);

    return {messages: {pl: flattenMessages(pl), en: flattenMessages(en)}};
}
