import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';

import {routing} from './routing';

async function importDictionary(
    locale: string,
    name: string,
): Promise<Record<string, string>> {
    return {
        [name]: (await import(`../../messages/${locale}/${name}.json`)).default,
    };
}

export default getRequestConfig(async ({requestLocale}) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    return {
        locale,
        timeZone: 'Europe/Warsaw',
        messages: {
            ...(await importDictionary(locale, 'about')),
            ...(await importDictionary(locale, 'common')),
            ...(await importDictionary(locale, 'contact')),
            ...(await importDictionary(locale, 'homepage')),
            ...(await importDictionary(locale, 'projects')),
        },
    };
});
