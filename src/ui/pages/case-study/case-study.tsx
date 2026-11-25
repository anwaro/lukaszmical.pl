import React from 'react';

import {getTranslations} from 'next-intl/server';

import {EntryListItem, LocalizedEntry} from '@/types/entry';
import {ContentMdx} from '@/ui/site/content-mdx';
import {ProductIcon, Prompt, stackLine} from '@/ui/site/site-parts';
import {SiteShell} from '@/ui/site/site-shell';

import {Link} from '@/navigation';

type Props = {
    caseStudy: LocalizedEntry;
    // 1-based position on the case studies list.
    position: number;
    next: EntryListItem | null;
    editHref?: string;
};

// "label: value" lines from the CMS, appended to the fixed facts.
function parseFacts(facts: string): [string, string][] {
    return facts
        .split('\n')
        .map((line) => line.split(/:(.*)/s).map((part) => part.trim()))
        .filter((parts) => parts[0] && parts[1])
        .map((parts) => [parts[0], parts[1]]);
}

function displayUrl(url: string) {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export async function PageCaseStudy({caseStudy, position, next, editHref}: Props) {
    const t = await getTranslations('caseStudies');

    const facts: [string, React.ReactNode][] = [
        [t('role'), caseStudy.role],
        [t('period'), caseStudy.period],
        [t('stack'), stackLine(caseStudy.stack)],
        [
            t('address'),
            caseStudy.siteUrl && (
                <a
                    key="site"
                    href={caseStudy.siteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-fg underline underline-offset-4 hover:text-accent"
                >
                    {displayUrl(caseStudy.siteUrl)}
                </a>
            ),
        ],
        ...parseFacts(caseStudy.facts),
    ];

    return (
        <SiteShell active="caseStudies" editHref={editHref}>
            <section className="flex flex-col gap-7 pt-[clamp(32px,5vw,64px)] pb-[clamp(32px,5vw,56px)]">
                <Link href="/case-studies" className="self-start py-3">
                    <Prompt>
                        cd .. <span className="text-soft">— {t('back')}</span>
                    </Prompt>
                </Link>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
                    <ProductIcon
                        src={caseStudy.cover}
                        alt={t('iconAlt', {name: caseStudy.title})}
                        name={caseStudy.title}
                        size={112}
                    />
                    <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-2">
                        <p className="m-0 font-term text-[13px] text-muted">
                            {String(position).padStart(2, '0')} · case-studies/
                            {caseStudy.slug}.md
                        </p>
                        <h1 className="m-0 font-term text-[clamp(36px,5.6vw,80px)] leading-[1.05] font-bold tracking-[-0.03em] wrap-anywhere">
                            {caseStudy.title}
                        </h1>
                    </div>
                </div>
                {(caseStudy.lead || caseStudy.description) && (
                    <p className="m-0 max-w-190 text-[clamp(19px,2vw,26px)] leading-[1.4]">
                        {caseStudy.lead || caseStudy.description}
                    </p>
                )}
                <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-8 gap-y-5 border-y border-line py-6 text-[15px]">
                    {facts
                        .filter(([, value]) => value)
                        .map(([label, value]) => (
                            <div key={label}>
                                <dt className="font-term text-[13px] text-accent">
                                    {label}
                                </dt>
                                <dd className="mt-1 ml-0 text-soft">{value}</dd>
                            </div>
                        ))}
                </dl>
            </section>

            <ContentMdx source={caseStudy.content} />

            {next && (
                <Link
                    href={`/case-studies/${next.slug}`}
                    className="group mt-[clamp(48px,7vw,96px)] flex flex-wrap items-center gap-x-7 gap-y-5 rounded-[10px] border border-line bg-panel p-[clamp(24px,4vw,40px)] hover:border-edge"
                >
                    <ProductIcon
                        src={next.cover}
                        alt={t('iconAlt', {name: next.title})}
                        name={next.title}
                        size={72}
                    />
                    <span className="flex min-w-0 flex-[1_1_280px] flex-col gap-1">
                        <span className="font-term text-[13px] text-muted">
                            {t('next')}
                        </span>
                        <span className="font-term text-[clamp(22px,2.6vw,34px)] font-bold tracking-[-0.02em] group-hover:text-accent">
                            {next.title}
                        </span>
                    </span>
                    <span className="font-term text-[15px] font-bold text-accent">
                        {t('read')}
                    </span>
                </Link>
            )}
        </SiteShell>
    );
}
