'use client';

import React from 'react';

import {useLocale} from 'next-intl';
import {clsx} from 'clsx';

import {Link, usePathname} from '@/navigation';
import {locales} from '@/config';

const order = [...locales].sort((a, b) => (a === 'pl' ? -1 : b === 'pl' ? 1 : 0));

export function LocaleSwitch() {
    const pathname = usePathname();
    const current = useLocale();

    return (
        <span className="flex items-center gap-2 py-3 text-muted">
            {order.map((locale, index) => (
                <React.Fragment key={locale}>
                    {index > 0 && <span aria-hidden="true">|</span>}
                    <Link
                        href={pathname}
                        locale={locale}
                        hrefLang={locale}
                        // Fully prefetch the other language, so switching
                        // to it is instant.
                        prefetch
                        aria-current={locale === current ? 'true' : undefined}
                        className={clsx(
                            'hover:text-accent',
                            locale === current ? 'text-fg' : 'text-muted',
                        )}
                    >
                        {locale}
                    </Link>
                </React.Fragment>
            ))}
        </span>
    );
}
