import React from 'react';

import {getTranslations} from 'next-intl/server';
import {clsx} from 'clsx';

import {LocaleSwitch} from './locale-switch';

import {Link} from '@/navigation';

type Section = 'caseStudies' | 'projects';

type Props = PWC<{
    active?: Section;
}>;

function Logo({label}: {label: string}) {
    return (
        <svg
            role="img"
            aria-label={label}
            width="32"
            height="40"
            viewBox="0 0 40 50"
            fill="none"
        >
            <polygon fill="#032b57" points="0 25, 0 50, 10 37.5" />
            <polygon fill="#064a96" points="0 0, 0 25, 20 50, 30 37.5" />
            <polygon fill="#0a6bd7" points="40 0, 20 25, 30 37.5, 40 25" />
            <polygon fill="#63a0e3" points="40 25, 30 37.5, 40 50" />
        </svg>
    );
}

export async function SiteShell({children, active}: Props) {
    const t = await getTranslations('common');

    const nav: {href: string; label: string; section?: Section}[] = [
        {href: '/case-studies', label: t('nav.caseStudies'), section: 'caseStudies'},
        {href: '/projects', label: t('nav.projects'), section: 'projects'},
        {href: '/#o-mnie', label: t('nav.about')},
        {href: '/#kontakt', label: t('nav.contact')},
    ];

    const links = [
        {href: t.raw('footer.githubUrl'), label: t('footer.github')},
        {href: t.raw('footer.linkedinUrl'), label: t('footer.linkedin')},
        {href: t.raw('footer.cvUrl'), label: t('footer.cv')},
    ].filter((link): link is {href: string; label: string} => Boolean(link.href));

    return (
        <div className="mx-auto w-full max-w-310 px-[clamp(20px,5vw,60px)] leading-[1.6]">
            <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-6 font-term text-sm">
                <Link
                    href="/"
                    className="inline-flex items-center gap-3.5 font-bold hover:text-accent"
                >
                    <Logo label={t('logoAlt')} />
                    <span>{t('brand')}</span>
                </Link>
                <nav aria-label={t('nav.label')} className="flex flex-wrap gap-x-7 gap-y-1">
                    {nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={
                                item.section && item.section === active
                                    ? 'page'
                                    : undefined
                            }
                            className={clsx(
                                'py-3 hover:text-accent',
                                item.section &&
                                    item.section === active &&
                                    'text-accent',
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <LocaleSwitch />
                </nav>
            </header>

            <main>{children}</main>

            <footer className="flex flex-wrap justify-between gap-x-8 gap-y-2 pt-7 pb-9 font-term text-[13px] text-muted">
                <span>{t('footer.copyright', {year: new Date().getFullYear()})}</span>
                <span className="flex flex-wrap gap-x-7 gap-y-1">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="py-3 text-fg hover:text-accent"
                        >
                            {link.label}
                        </a>
                    ))}
                </span>
            </footer>
        </div>
    );
}
