import React from 'react';

import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {clsx} from 'clsx';

import {EntryListItem} from '@/types/entry';
import {
    CtaBanner,
    ProjectAnchor,
    Prompt,
    stackLine,
} from '@/ui/site/site-parts';
import {SiteShell} from '@/ui/site/site-shell';

type Props = {
    projects: EntryListItem[];
};

const badgeClass = {
    page: 'bg-accent px-2.5 py-1 font-bold text-ink',
    app: 'border border-muted px-2.5 py-[3px] text-fg',
};

// A project either has a write-up page or opens straight as an app.
export const projectKind = (project: Pick<EntryListItem, 'presentation'>) =>
    project.presentation === 'article' ? 'page' : 'app';

export async function PageProjects({projects}: Props) {
    const t = await getTranslations('projects');

    return (
        <SiteShell active="projects">
            <section className="flex flex-col gap-5 pt-[clamp(40px,6vw,80px)] pb-[clamp(32px,5vw,56px)]">
                <Prompt>{t('command')}</Prompt>
                <h1 className="m-0 font-term text-[clamp(34px,5.2vw,72px)] leading-[1.08] font-bold tracking-[-0.03em]">
                    {t('heading')}
                </h1>
                <p className="m-0 max-w-155 text-[clamp(17px,1.4vw,19px)] text-soft">
                    {t('lead')}
                </p>
                <div className="flex flex-wrap gap-x-7 gap-y-3 font-term text-[13px] text-soft">
                    {(['page', 'app'] as const).map((kind) => (
                        <span key={kind} className="inline-flex items-center gap-2.5">
                            <span className={clsx('rounded-sm', badgeClass[kind])}>
                                {t(`badge.${kind}`)}
                            </span>
                            {t(`legend.${kind}`)}
                        </span>
                    ))}
                </div>
            </section>

            <section
                aria-label={t('listLabel')}
                className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6 pb-[clamp(64px,8vw,112px)]"
            >
                {projects.map((project) => {
                    const kind = projectKind(project);
                    return (
                        <ProjectAnchor
                            key={project.id}
                            project={project}
                            className="group flex flex-col overflow-hidden rounded-[10px] border border-line bg-panel hover:border-edge"
                        >
                            <span className="relative flex aspect-16/10 items-center justify-center bg-cell font-term text-[13px] text-muted">
                                {project.cover ? (
                                    <Image
                                        src={project.cover}
                                        alt={t('coverAlt', {name: project.title})}
                                        fill
                                        sizes="(min-width: 1024px) 400px, 100vw"
                                        className="object-cover"
                                    />
                                ) : (
                                    project.title
                                )}
                            </span>
                            <span className="flex flex-1 flex-col gap-2.5 p-5">
                                <span
                                    className={clsx(
                                        'self-start rounded-sm font-term text-xs',
                                        badgeClass[kind],
                                    )}
                                >
                                    {t(`badge.${kind}`)}
                                </span>
                                <span className="font-term text-[22px] font-bold tracking-[-0.02em] group-hover:text-accent">
                                    {project.title}
                                </span>
                                <span className="text-[15px] text-soft">
                                    {project.description}
                                </span>
                                {project.stack.length > 0 && (
                                    <span className="font-term text-[13px] text-muted">
                                        {stackLine(project.stack)}
                                    </span>
                                )}
                                <span className="mt-auto pt-3 font-term text-sm font-bold text-accent">
                                    {t(`more.${kind}`)}
                                </span>
                            </span>
                        </ProjectAnchor>
                    );
                })}
            </section>

            <CtaBanner
                text={t('cta.text')}
                button={t('cta.button')}
                href="/case-studies"
            />
        </SiteShell>
    );
}
