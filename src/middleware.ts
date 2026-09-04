import createMiddleware from 'next-intl/middleware';
import {type NextRequest, NextResponse} from 'next/server';

import {SESSION_COOKIE, verifySessionToken} from '@/utils/auth/session';

import {routing} from './i18n/routing';

const i18nMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    if (pathname.startsWith('/admin')) {
        if (pathname.startsWith('/admin/auth')) {
            return NextResponse.next();
        }

        const token = request.cookies.get(SESSION_COOKIE)?.value;
        if (!(await verifySessionToken(token))) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/auth/login';
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    }

    return i18nMiddleware(request);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
