import React from 'react';

import Image from 'next/image';
import {clsx} from 'clsx';

import {EntryListItem} from '@/types/entry';

import {Link} from '@/navigation';

// `$ command` / `# heading` line used above every section.
export function Prompt({
    children,
    symbol = '$',
    as: Tag = 'p',
    className,
}: PWC<{symbol?: string; as?: 'p' | 'h2'; className?: string}>) {
    return (
        <Tag className={clsx('m-0 font-term text-sm font-medium text-muted', className)}>
            <span className="text-accent">{symbol}</span> {children}
        </Tag>
    );
}

export const buttonClass = {
    primary:
        'inline-flex min-h-12 items-center rounded-md bg-accent px-6 font-term text-[15px] font-bold text-ink hover:bg-fg',
    secondary:
        'inline-flex min-h-12 items-center rounded-md border border-edge px-6 font-term text-[15px] font-medium hover:border-accent hover:text-accent',
};

export const stackLine = (stack: string[]) => stack.join(' · ');

// Projects open as a page on this site unless they are an external link.
type ProjectTarget = Pick<EntryListItem, 'presentation' | 'slug' | 'linkUrl'>;

export function projectHref(project: ProjectTarget) {
    return project.presentation === 'link' && project.linkUrl
        ? project.linkUrl
        : `/projects/${project.slug}`;
}

export function ProjectAnchor({
    project,
    children,
    className,
}: PWC<{project: ProjectTarget; className?: string}>) {
    // External projects open in a new tab, unless they point back at this site.
    const href = projectHref(project);

    if (project.presentation === 'link' && !href.startsWith('/')) {
        return (
            <a href={href} target="_blank" rel="noreferrer" className={className}>
                {children}
            </a>
        );
    }
    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
}

// Square product icon; falls back to the first letter when none is uploaded.
export function ProductIcon({
    src,
    alt,
    name,
    size,
    className,
}: {
    src: string | null;
    alt: string;
    name: string;
    size: number;
    className?: string;
}) {
    const style = {width: size, height: size, borderRadius: Math.round(size * 0.21)};

    if (!src) {
        return (
            <span
                aria-hidden="true"
                style={style}
                className={clsx(
                    'flex shrink-0 items-center justify-center border border-line bg-cell font-term font-bold text-accent',
                    className,
                )}
            >
                {name.slice(0, 1).toUpperCase()}
            </span>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            style={style}
            className={clsx('block shrink-0 object-cover', className)}
        />
    );
}

// `ls -l` style row: name, description, trailing note.
export function ProjectRow({project, note}: {project: EntryListItem; note: string}) {
    return (
        <ProjectAnchor
            project={project}
            className="group flex flex-wrap items-baseline gap-x-8 gap-y-1.5 border-b border-line py-[22px]"
        >
            <span className="flex-[1_1_260px] font-term text-[clamp(18px,1.8vw,24px)] font-bold group-hover:text-accent">
                {project.title}
            </span>
            <span className="flex-[2_1_320px] text-soft">{project.description}</span>
            <span className="flex-[0_1_200px] font-term text-[13px] text-muted">
                {note}
            </span>
        </ProjectAnchor>
    );
}

export function CtaBanner({
    text,
    button,
    href,
}: {
    text: string;
    button: string;
    href: string;
}) {
    return (
        <section className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 rounded-[10px] border border-line bg-panel p-[clamp(28px,4vw,48px)]">
            <p className="m-0 flex-[1_1_320px] font-term text-[clamp(20px,2.2vw,28px)] leading-tight font-bold tracking-[-0.02em]">
                {text}
            </p>
            <Link href={href} className={buttonClass.primary}>
                {button}
            </Link>
        </section>
    );
}
