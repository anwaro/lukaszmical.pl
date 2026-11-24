import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';

import {getMessages} from '@/services/content/content-store';

import {routing} from './routing';

export default getRequestConfig(async ({locale: explicit, requestLocale}) => {
    // An explicit locale (`getTranslations({locale})`) wins over the request's:
    // the admin preview renders content outside of a localized route.
    const requested = explicit ?? (await requestLocale);
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    return {
        locale,
        timeZone: 'Europe/Warsaw',
        messages: await getMessages(locale),
    };
});
