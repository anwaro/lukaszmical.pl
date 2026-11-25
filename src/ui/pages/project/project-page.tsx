import React from 'react';

import Image from 'next/image';
import {getTranslations} from 'next-intl/server';

import {EntryListItem, LocalizedEntry} from '@/types/entry';
import {ContentMdx} from '@/ui/site/content-mdx';
import {buttonClass, ProjectRow, Prompt, stackLine} from '@/ui/site/site-parts';
import {SiteShell} from '@/ui/site/site-shell';

import {projectKind} from './projects';

import {Link} from '@/navigation';

type Props = {
    project: LocalizedEntry;
    others: EntryListItem[];
    editHref?: string;
};

export async function ProjectPage({project, others, editHref}: Props) {
    const t = await getTranslations('projects');
    const facts = [...project.stack, project.period].filter(Boolean) as string[];

    return (
        <SiteShell active="projects" editHref={editHref}>
            <section className="flex flex-wrap items-center gap-x-16 gap-y-12 pt-[clamp(32px,5vw,64px)]">
                <div className="flex min-w-0 flex-[3_1_440px] flex-col gap-6">
                    <Link href="/projects" className="self-start py-3">
                        <Prompt>
                            cd .. <span className="text-soft">— {t('back')}</span>
                        </Prompt>
                    </Link>
                    <h1 className="m-0 font-term text-[clamp(32px,4.6vw,64px)] leading-[1.08] font-bold tracking-[-0.03em] wrap-anywhere">
                        {project.title}
                    </h1>
                    {(project.lead || project.description) && (
                        <p className="m-0 max-w-140 text-[clamp(18px,1.7vw,22px)] leading-[1.45] text-soft">
                            {project.lead || project.description}
                        </p>
                    )}
                    {(project.siteUrl || project.repoUrl) && (
                        <div className="flex flex-wrap gap-3">
                            {project.siteUrl && (
                                <a href={project.siteUrl} className={buttonClass.primary}>
                                    {t('demo')}
                                </a>
                            )}
                            {project.repoUrl && (
                                <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={buttonClass.secondary}
                                >
                                    {t('repo')}
                                </a>
                            )}
                        </div>
                    )}
                    {facts.length > 0 && (
                        <p className="m-0 font-term text-[13px] text-muted">
                            {stackLine(facts)}
                        </p>
                    )}
                </div>
                {project.cover && (
                    <div className="relative aspect-16/10 min-w-0 flex-[2_1_360px] overflow-hidden rounded-[10px] border border-line bg-panel">
                        <Image
                            src={project.cover}
                            alt={t('coverAlt', {name: project.title})}
                            fill
                            sizes="(min-width: 1024px) 480px, 100vw"
                            className="object-cover"
                        />
                    </div>
                )}
            </section>

            <ContentMdx source={project.content} />

            {others.length > 0 && (
                <section className="flex flex-col gap-5 pt-[clamp(48px,7vw,96px)]">
                    <Prompt as="h2">{t('others')}</Prompt>
                    <div className="border-t border-line">
                        {others.map((other) => (
                            <ProjectRow
                                key={other.id}
                                project={other}
                                note={t(`badge.${projectKind(other)}`)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </SiteShell>
    );
}
