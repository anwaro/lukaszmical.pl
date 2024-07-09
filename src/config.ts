import {LocalePrefix} from 'next-intl/routing';
export const locales = ['en', 'pl'] as const;

export const defaultLocale = 'pl';

export const localePrefix = 'as-needed' satisfies LocalePrefix;
