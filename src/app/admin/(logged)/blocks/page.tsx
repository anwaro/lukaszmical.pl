import React from 'react';

import Link from 'next/link';
import {NextIntlClientProvider} from 'next-intl';
import {clsx} from 'clsx';

import {
    previewMdxAction,
    PreviewMdxResult,
} from '@/admin/actions/preview-mdx-action';
import {Card} from '@/admin/components/card/card';
import {CardHeader} from '@/admin/components/card/card-header';
import {chipClassName} from '@/admin/components/chip-class-name';
import {noticeDangerClassName} from '@/admin/components/notice-class-name';
import {PageHeader} from '@/admin/components/section/page-header';
import SectionMain from '@/admin/components/section/section-main';
import {Locale, LocaleList} from '@/types/locale';
import {
    BlockEntry,
    blockSections,
    BlockSection,
} from '@/ui/site/blocks/block-library';
import {contentProseClass} from '@/ui/site/content-mdx-components';
import {auth} from '@/utils/auth/auth';

type Props = {
    searchParams: Promise<{locale?: string}>;
};

type RenderedBlock = BlockEntry & {result: PreviewMdxResult};

const sections: readonly BlockSection[] = blockSections;

export default async function BlocksPage({searchParams}: Props) {
    await auth();
    const requested = (await searchParams).locale;
    const locale: Locale = LocaleList.includes(requested as Locale)
        ? (requested as Locale)
        : 'pl';

    const renderedSections = await Promise.all(
        sections.map(async (section) => ({
            ...section,
            blocks: await Promise.all(
                section.blocks.map(async (block): Promise<RenderedBlock> => ({
                    ...block,
                    result: await previewMdxAction(block.snippet, locale),
                })),
            ),
        })),
    );

    return (
        <SectionMain>
            <PageHeader
                title="Biblioteka bloczków"
                description="Każdy blok z block-library.ts, z żywym podglądem i kodem MDX. Bloki z sekcji „Dynamic” czytają prawdziwe dane z bazy."
            >
                <div className="flex gap-1.5">
                    {LocaleList.map((item) => (
                        <Link
                            key={item}
                            href={`/admin/blocks?locale=${item}`}
                            aria-pressed={item === locale}
                            className={chipClassName()}
                        >
                            {item.toUpperCase()}
                        </Link>
                    ))}
                </div>
            </PageHeader>
            <NextIntlClientProvider
                locale={locale}
                messages={{}}
                timeZone="Europe/Warsaw"
            >
                <div className="flex flex-col gap-8">
                    {renderedSections.map((section) => (
                        <Card key={section.id} padding="lg">
                            <CardHeader
                                title={section.title}
                                description={section.description}
                            />
                            <div className="flex flex-col gap-6">
                                {section.blocks.map((block) => (
                                    <div
                                        key={block.name}
                                        className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
                                    >
                                        <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                                            <span className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400">
                                                {`<${block.name}>`}
                                            </span>
                                            {block.parts && (
                                                <span className="ml-2 font-mono text-xs text-slate-400">
                                                    {block.parts
                                                        .map((part) => `<${part}>`)
                                                        .join(' ')}
                                                </span>
                                            )}
                                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {block.description}
                                            </p>
                                        </div>
                                        <div className="grid lg:grid-cols-2">
                                            <pre className="m-0 overflow-x-auto rounded-none bg-slate-900 p-3 font-mono text-xs/[18px] whitespace-pre-wrap text-slate-300 dark:bg-black">
                                                {block.snippet}
                                            </pre>
                                            <div
                                                className={clsx(
                                                    'overflow-auto bg-ink p-4 text-fg',
                                                    contentProseClass,
                                                )}
                                            >
                                                {'error' in block.result ? (
                                                    <pre className={noticeDangerClassName()}>
                                                        {block.result.error}
                                                    </pre>
                                                ) : (
                                                    block.result.node
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </NextIntlClientProvider>
        </SectionMain>
    );
}
