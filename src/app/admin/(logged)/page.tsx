import React from 'react';

import {BookOpen, Code, Files, House, Languages, LucideIcon} from 'lucide-react';
import Link from 'next/link';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/section/section-main';
import {PageHeader} from '@/admin/components/section/page-header';
import {Card} from '@/admin/components/card/card';
import {StatCard} from '@/admin/components/card/stat-card';
import {EntryRepository} from '@/services/content/repository-entry';
import {EntryKind} from '@/types/entry';

type Shortcut = {
    href: string;
    icon: LucideIcon;
    title: string;
    description: string;
};

const shortcuts: Shortcut[] = [
    {
        href: '/admin/homepage',
        icon: House,
        title: 'Strona główna',
        description: 'Bloki strony pod adresem /',
    },
    {
        href: '/admin/pages',
        icon: Files,
        title: 'Strony',
        description: 'Strony statyczne',
    },
    {
        href: '/admin/case-studies',
        icon: BookOpen,
        title: 'Case studies',
        description: 'Opisy realizacji',
    },
    {
        href: '/admin/projects',
        icon: Code,
        title: 'Projekty',
        description: 'Artykuły, aplikacje i linki',
    },
    {
        href: '/admin/translations',
        icon: Languages,
        title: 'Tłumaczenia',
        description: 'Teksty interfejsu PL i EN',
    },
];

const stats: {kind: EntryKind; label: string}[] = [
    {kind: 'page', label: 'Strony'},
    {kind: 'case_study', label: 'Case studies'},
    {kind: 'project', label: 'Projekty'},
];

export default async function PrivatePage() {
    await auth();
    const repository = new EntryRepository();
    const counts = await Promise.all(
        stats.map(async (stat) => {
            const entries = await repository.listAll(stat.kind);
            return {
                ...stat,
                total: entries.length,
                published: entries.filter((entry) => entry.published).length,
            };
        }),
    );

    return (
        <SectionMain>
            <PageHeader title="Panel" description="Treść serwisu lukaszmical.pl." />

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {counts.map((stat) => (
                    <StatCard
                        key={stat.kind}
                        label={stat.label}
                        value={stat.total}
                        meta={`Opublikowane: ${stat.published}`}
                    />
                ))}
            </div>

            <h2 className="mb-4 text-lg/7 font-semibold text-slate-900 dark:text-white">
                Przejdź do
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shortcuts.map(({href, icon: Icon, title, description}) => (
                    <Link key={href} href={href} className="group">
                        <Card className="flex h-full items-start gap-3 transition-colors group-hover:border-blue-500">
                            <span className="flex size-9 flex-none items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                                <Icon
                                    className="size-5 shrink-0"
                                    strokeWidth={1.8}
                                    aria-hidden
                                />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                                    {title}
                                </span>
                                <span className="mt-0.5 block text-xs font-normal text-slate-500 dark:text-slate-400">
                                    {description}
                                </span>
                            </span>
                        </Card>
                    </Link>
                ))}
            </div>
        </SectionMain>
    );
}
