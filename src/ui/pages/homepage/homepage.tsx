import React from 'react';

import {getTranslations} from 'next-intl/server';

import {getSettings, parseList} from '@/services/content/content-store';
import {ProjectListItem} from '@/types/project';
import {ObfuscatedEmail} from '@/ui/site/obfuscated-email';
import {
    buttonClass,
    ProductIcon,
    ProjectRow,
    Prompt,
    stackLine,
} from '@/ui/site/site-parts';
import {SiteShell} from '@/ui/site/site-shell';
import {SolverPanel} from '@/ui/site/solver-panel';
import {encodeEmail} from '@/utils/email-obfuscate';

import {Link} from '@/navigation';

type Props = {
    caseStudies: ProjectListItem[];
    projects: ProjectListItem[];
};

const sectionGap = 'pb-[clamp(64px,8vw,112px)]';

export async function PageHomepage({caseStudies, projects}: Props) {
    const t = await getTranslations('homepage');
    const tCase = await getTranslations('caseStudies');
    const settings = await getSettings();
    const stack = parseList(settings.stack);

    return (
        <SiteShell>
            <section className="flex flex-wrap items-center gap-x-16 gap-y-12 pt-[clamp(40px,7vw,96px)] pb-[clamp(56px,8vw,112px)]">
                <div className="flex min-w-0 flex-[3_1_440px] flex-col gap-7">
                    <Prompt>{t('hero.command')}</Prompt>
                    <h1 className="m-0 font-term text-[clamp(34px,5.2vw,72px)] leading-[1.08] font-bold tracking-[-0.03em]">
                        {t('hero.titleLine1')}
                        <br />
                        {t('hero.titleLine2')}
                        <span className="text-accent">_</span>
                    </h1>
                    <p className="m-0 max-w-135 text-[clamp(17px,1.4vw,19px)] text-soft">
                        {t('hero.lead')}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/#case-studies" className={buttonClass.primary}>
                            {t('hero.ctaPrimary')}
                        </Link>
                        <Link href="/#kontakt" className={buttonClass.secondary}>
                            {t('hero.ctaSecondary')}
                        </Link>
                    </div>
                </div>
                <SolverPanel
                    label={t('solver.label')}
                    status={t('solver.status')}
                    alt={t('solver.alt')}
                    caption={t('solver.caption')}
                />
            </section>

            {caseStudies.length > 0 && (
                <section id="case-studies" className={sectionGap}>
                    <Prompt as="h2" className="mb-8">
                        {t('caseStudies.command')}
                    </Prompt>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6">
                        {caseStudies.map((item, index) => (
                            <article
                                key={item.id}
                                className="flex flex-col overflow-hidden rounded-[10px] border border-line bg-panel"
                            >
                                <div className="border-b border-line px-5 py-3 font-term text-xs text-muted">
                                    {String(index + 1).padStart(2, '0')} · {item.url}.md
                                </div>
                                <div className="flex flex-1 flex-col gap-5 px-5 pt-7 pb-6">
                                    <ProductIcon
                                        src={item.cover}
                                        alt={tCase('iconAlt', {name: item.name})}
                                        name={item.name}
                                        size={64}
                                    />
                                    <h3 className="m-0 font-term text-[clamp(24px,2.4vw,32px)] leading-[1.15] font-bold tracking-[-0.02em]">
                                        {item.headline || item.name}
                                    </h3>
                                    <dl className="m-0 flex flex-col gap-3.5 text-[15px]">
                                        {(['problem', 'approach', 'result'] as const)
                                            .filter((field) => item[field])
                                            .map((field) => (
                                                <div
                                                    key={field}
                                                    className="flex flex-wrap gap-x-4 gap-y-1"
                                                >
                                                    <dt className="flex-[0_0_96px] font-term text-[13px] text-accent">
                                                        {t(`caseStudies.${field}`)}
                                                    </dt>
                                                    <dd className="m-0 flex-[1_1_220px] text-soft">
                                                        {item[field]}
                                                    </dd>
                                                </div>
                                            ))}
                                    </dl>
                                    <Link
                                        href={`/case-studies/${item.url}`}
                                        className="mt-auto pt-3 font-term text-sm font-bold text-accent hover:text-fg"
                                    >
                                        {t('caseStudies.more')}
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {projects.length > 0 && (
                <section id="projekty" className={sectionGap}>
                    <Prompt as="h2" className="mb-6">
                        {t('projects.command')}
                    </Prompt>
                    <div className="border-t border-line">
                        {projects.map((project) => (
                            <ProjectRow
                                key={project.id}
                                project={project}
                                note={stackLine(project.stack)}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section id="o-mnie" className={`flex flex-wrap gap-x-16 gap-y-8 ${sectionGap}`}>
                <div className="flex min-w-0 flex-[3_1_400px] flex-col gap-5">
                    <Prompt as="h2">{t('about.command')}</Prompt>
                    <p className="m-0 text-[clamp(19px,2vw,26px)] leading-[1.4] whitespace-pre-line">
                        {t('about.text')}
                    </p>
                </div>
                {stack.length > 0 && (
                    <div className="min-w-0 flex-[2_1_300px] self-start rounded-[10px] border border-line bg-panel p-6 font-term text-sm leading-[1.9]">
                        <div>
                            <span className="text-muted">{t('about.stackLabel')}</span> = [
                        </div>
                        <div className="flex flex-wrap gap-x-2 pl-6">
                            {stack.map((item) => (
                                <span key={item}>
                                    <span className="text-accent">{`"${item}"`}</span>,
                                </span>
                            ))}
                        </div>
                        <div>]</div>
                    </div>
                )}
            </section>

            <section
                id="kontakt"
                className="rounded-[10px] border border-line bg-panel px-[clamp(20px,4vw,56px)] py-[clamp(40px,6vw,80px)]"
            >
                <Prompt className="mb-4">{t('contact.command')}</Prompt>
                {settings.email ? (
                    <ObfuscatedEmail
                        encoded={encodeEmail(settings.email)}
                        className="inline-block font-term text-[clamp(26px,4.6vw,60px)] leading-[1.1] font-bold tracking-[-0.03em] wrap-anywhere hover:text-accent"
                    />
                ) : (
                    <span className="inline-block font-term text-[clamp(26px,4.6vw,60px)] leading-[1.1] font-bold tracking-[-0.03em] wrap-anywhere">
                        {t('contact.emailPlaceholder')}
                    </span>
                )}
                <p className="mt-5 mb-0 max-w-130 text-soft">{t('contact.text')}</p>
            </section>
        </SiteShell>
    );
}
