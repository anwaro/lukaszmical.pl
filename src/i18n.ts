import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from './config';

async function importDictionary(
    locale: string,
    name: string,
): Promise<Record<string, string>> {
    return {
        [name]: (await import(`../messages/${locale}/${name}.json`)).default,
    };
}

export default getRequestConfig(async ({locale}) => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    if (!locales.includes(locale as any)) notFound();

    return {
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
