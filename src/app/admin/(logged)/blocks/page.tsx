import React from 'react';

import Link from 'next/link';
import {NextIntlClientProvider} from 'next-intl';
import {clsx} from 'clsx';

import {
    previewMdxAction,
    PreviewMdxResult,
} from '@/admin/actions/preview-mdx-action';
import {Card, CardHeader} from '@/admin/components/card/card';
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
                            className="kv-chip"
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
                                        className="overflow-hidden rounded-lg border border-(--border-control)"
                                    >
                                        <div className="border-b border-(--border-subtle) px-4 py-3">
                                            <span className="kv-kbd font-medium text-(--accent-ink)">
                                                {`<${block.name}>`}
                                            </span>
                                            {block.parts && (
                                                <span className="kv-kbd ml-2 text-(--ink-faint)">
                                                    {block.parts
                                                        .map((part) => `<${part}>`)
                                                        .join(' ')}
                                                </span>
                                            )}
                                            <p className="kv-caption mt-1">
                                                {block.description}
                                            </p>
                                        </div>
                                        <div className="grid lg:grid-cols-2">
                                            <pre className="kv-code m-0 rounded-none">
                                                {block.snippet}
                                            </pre>
                                            <div
                                                className={clsx(
                                                    'overflow-auto bg-ink p-4 text-fg',
                                                    contentProseClass,
                                                )}
                                            >
                                                {'error' in block.result ? (
                                                    <pre className="kv-notice kv-notice-danger">
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
