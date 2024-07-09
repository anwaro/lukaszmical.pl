import createMiddleware from 'next-intl/middleware';
import {defaultLocale, locales} from './config';

export default createMiddleware({
    // A list of all locales that are supported
    locales: locales,

    // Used when no locale matches
    defaultLocale: defaultLocale,
});

export const config = {
    // Match only internationalized pathnames

    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|.*\\..*).*)',
        '/',
        `/(en|pl)/:path*`,
    ],
};
