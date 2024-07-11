import createMiddleware from 'next-intl/middleware';
import {type NextRequest} from 'next/server';

import {defaultLocale, localePrefix, locales} from './config';
import {updateSession} from '@/utils/supabase/middleware';

const i18nMiddleware = createMiddleware({
    locales,
    localePrefix,
    defaultLocale,
});

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
        return await updateSession(request);
    } else {
        return i18nMiddleware(request);
    }
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
