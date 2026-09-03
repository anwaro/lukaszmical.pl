import createMiddleware from 'next-intl/middleware';
import {type NextRequest} from 'next/server';

import {updateSession} from '@/utils/supabase/middleware';

import {routing} from './i18n/routing';

const i18nMiddleware = createMiddleware(routing);

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
