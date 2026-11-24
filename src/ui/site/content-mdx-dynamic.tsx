import React from 'react';

import {getTranslations} from 'next-intl/server';

import {EntryRepository} from '@/services/content/repository-entry';
import {Locale} from '@/types/locale';

import {DynamicBlockName} from './blocks/block-library';
import {sectionGap} from './content-mdx-components';
import {ProductIcon, ProjectRow, Prompt, stackLine} from './site-parts';

import {Link} from '@/navigation';

// Blocks of the library that render CMS data: lists of entries.
// They are bound to a locale, because content is also rendered outside of a
// localized route (the admin preview).

// How many projects <ProjectList> shows when none is marked as featured.
const PROJECTS_FALLBACK = 3;

type ListProps = {id?: string; command?: string};

export function contentMdxDynamicComponents(locale: Locale) {
    async function CaseStudyList({id, command}: ListProps) {
        const [t, caseStudies] = await Promise.all([
            getTranslations({locale, namespace: 'caseStudies'}),
            new EntryRepository().list(locale, {kind: 'case_study'}),
        ]);

        if (!caseStudies.length) {
            return null;
        }

        return (
            <section id={id} className={sectionGap}>
                {command && (
                    <Prompt as="h2" className="mb-8">
                        {command}
                    </Prompt>
                )}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6">
                    {caseStudies.map((item, index) => (
                        <article
                            key={item.id}
                            className="flex flex-col overflow-hidden rounded-[10px] border border-line bg-panel"
                        >
                            <div className="border-b border-line px-5 py-3 font-term text-xs text-muted">
                                {String(index + 1).padStart(2, '0')} · {item.slug}.md
                            </div>
                            <div className="flex flex-1 flex-col gap-5 px-5 pt-7 pb-6">
                                <ProductIcon
                                    src={item.cover}
                                    alt={t('iconAlt', {name: item.title})}
                                    name={item.title}
                                    size={64}
                                />
                                <h3 className="m-0 font-term text-[clamp(24px,2.4vw,32px)] leading-[1.15] font-bold tracking-[-0.02em]">
                                    {item.headline || item.title}
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
                                                    {t(`card.${field}`)}
                                                </dt>
                                                <dd className="m-0 flex-[1_1_220px] text-soft">
                                                    {item[field]}
                                                </dd>
                                            </div>
                                        ))}
                                </dl>
                                <Link
                                    href={`/case-studies/${item.slug}`}
                                    className="mt-auto pt-3 font-term text-sm font-bold text-accent hover:text-fg"
                                >
                                    {t('card.more')}
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        );
    }

    async function ProjectList({id, command, limit}: ListProps & {limit?: string}) {
        const client = new EntryRepository();
        const featured = await client.list(locale, {kind: 'project', featured: true});
        const projects = featured.length
            ? featured
            : (await client.list(locale, {kind: 'project'})).slice(
                  0,
                  Number(limit) || PROJECTS_FALLBACK,
              );

        if (!projects.length) {
            return null;
        }

        return (
            <section id={id} className={sectionGap}>
                {command && (
                    <Prompt as="h2" className="mb-6">
                        {command}
                    </Prompt>
                )}
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
        );
    }

    return {CaseStudyList, ProjectList} satisfies Record<
        DynamicBlockName,
        unknown
    >;
}
