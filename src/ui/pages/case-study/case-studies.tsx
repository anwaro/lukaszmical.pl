import React from 'react';

import {getTranslations} from 'next-intl/server';

import {ProjectListItem} from '@/types/project';
import {CtaBanner, ProductIcon, Prompt, stackLine} from '@/ui/site/site-parts';
import {SiteShell} from '@/ui/site/site-shell';

import {Link} from '@/navigation';

type Props = {
    caseStudies: ProjectListItem[];
};

export async function PageCaseStudies({caseStudies}: Props) {
    const t = await getTranslations('caseStudies');

    return (
        <SiteShell active="caseStudies">
            <section className="flex flex-col gap-5 pt-[clamp(40px,6vw,80px)] pb-[clamp(32px,5vw,56px)]">
                <Prompt>{t('command')}</Prompt>
                <h1 className="m-0 font-term text-[clamp(34px,5.2vw,72px)] leading-[1.08] font-bold tracking-[-0.03em]">
                    {t('heading')}
                </h1>
                <p className="m-0 max-w-155 text-[clamp(17px,1.4vw,19px)] text-soft">
                    {t('lead')}
                </p>
            </section>

            <section
                aria-label={t('listLabel')}
                className="flex flex-col gap-6 pb-[clamp(64px,8vw,112px)]"
            >
                {caseStudies.map((item, index) => (
                    <Link
                        key={item.id}
                        href={`/case-studies/${item.url}`}
                        className="group flex flex-wrap items-start gap-x-10 gap-y-6 rounded-[10px] border border-line bg-panel p-[clamp(20px,3vw,36px)] hover:border-edge"
                    >
                        <ProductIcon
                            src={item.cover}
                            alt={t('iconAlt', {name: item.name})}
                            name={item.name}
                            size={96}
                        />
                        <span className="flex min-w-0 flex-[3_1_380px] flex-col gap-3">
                            <span className="font-term text-xs text-muted">
                                {String(index + 1).padStart(2, '0')} · {item.url}.md
                            </span>
                            <span className="font-term text-[clamp(24px,2.8vw,38px)] leading-[1.12] font-bold tracking-[-0.02em] group-hover:text-accent">
                                {item.name}
                            </span>
                            <span className="max-w-140 text-soft">
                                {item.description}
                            </span>
                            <span className="mt-2 font-term text-sm font-bold text-accent">
                                {t('more')}
                            </span>
                        </span>
                        <span className="flex min-w-0 flex-[1_1_240px] flex-col gap-2.5 text-sm">
                            {(
                                [
                                    ['role', item.role],
                                    ['period', item.period],
                                    ['stack', stackLine(item.stack)],
                                ] as const
                            )
                                .filter(([, value]) => value)
                                .map(([label, value]) => (
                                    <span key={label} className="flex gap-4">
                                        <span className="flex-[0_0_64px] font-term text-[13px] text-accent">
                                            {t(label)}
                                        </span>
                                        <span className="text-soft">{value}</span>
                                    </span>
                                ))}
                        </span>
                    </Link>
                ))}
            </section>

            <CtaBanner text={t('cta.text')} button={t('cta.button')} href="/projects" />
        </SiteShell>
    );
}
