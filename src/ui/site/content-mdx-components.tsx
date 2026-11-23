import React from 'react';

import {clsx} from 'clsx';

import '@/admin/css/github-dark.css';

import {Prompt} from './site-parts';

// Building blocks available in the MDX content of case studies and projects.
// Props are plain strings so they survive next-mdx-remote's JS blocking.

const panel = 'rounded-[10px] border border-line bg-panel';

// Two-column block: `# title` on the left, content on the right.
function Section({title, children}: PWC<{title: string}>) {
    return (
        <section className="flex flex-wrap gap-x-16 gap-y-4 pt-[clamp(48px,7vw,96px)]">
            <Prompt as="h2" symbol="#" className="flex-[1_1_220px]">
                {title}
            </Prompt>
            <div className="flex min-w-0 flex-[3_1_480px] flex-col gap-6 text-soft [&>p]:max-w-190">
                {children}
            </div>
        </section>
    );
}

// Opening paragraph of a section, larger and brighter than the rest.
function Big({children}: PWC) {
    return (
        <div className="max-w-190 text-[clamp(19px,1.8vw,24px)] leading-[1.45] text-fg">
            {children}
        </div>
    );
}

// Screenshot slot: an image when `src` is set, a labelled placeholder otherwise.
function Shot({src, alt, ratio = '16 / 8', children}: PWC<{src?: string; alt?: string; ratio?: string}>) {
    return (
        <div
            style={{aspectRatio: ratio}}
            className={clsx(
                panel,
                'flex items-center justify-center overflow-hidden p-4 text-center font-term text-[13px] text-muted',
                src && 'p-0',
            )}
        >
            {src ? (
                // eslint-disable-next-line nextjs/no-img-element -- CMS content, host unknown
                <img src={src} alt={alt ?? ''} className="size-full object-cover" />
            ) : (
                children
            )}
        </div>
    );
}

function Shots({children}: PWC) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 pt-[clamp(48px,7vw,96px)]">
            {children}
        </div>
    );
}

// Architecture diagram: <Step> boxes joined by <Arrow>s.
function Flow({children}: PWC) {
    return <div className="flex flex-wrap items-stretch gap-3">{children}</div>;
}

function Step({title, highlight, children}: PWC<{title: string; highlight?: boolean}>) {
    return (
        <div
            className={clsx(
                panel,
                'flex-[1_1_170px] p-5',
                highlight && 'border-accent',
            )}
        >
            <p className="m-0 mb-2 font-term text-base font-bold text-fg">{title}</p>
            <div className="text-sm text-soft">{children}</div>
        </div>
    );
}

function Arrow({label}: {label?: string}) {
    return (
        <div aria-hidden="true" className="flex-none self-center font-term text-xs text-accent">
            {label ? `${label} ->` : '->'}
        </div>
    );
}

// Numbered list of decisions; numbers come from a CSS counter.
function Decisions({children}: PWC) {
    return (
        <ol className="m-0 flex list-none flex-col border-t border-line p-0 [counter-reset:decision]">
            {children}
        </ol>
    );
}

function Decision({title, children}: PWC<{title: string}>) {
    return (
        <li className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line py-6 [counter-increment:decision] before:flex-[0_0_40px] before:font-term before:text-sm before:text-accent before:content-[counter(decision,decimal-leading-zero)]">
            <span className="flex flex-[1_1_320px] flex-col gap-1.5">
                <span className="font-term text-lg font-bold text-fg">{title}</span>
                <span className="text-soft">{children}</span>
            </span>
        </li>
    );
}

// Wrap a markdown list to render it as a row of chips.
function Chips({children}: PWC) {
    return (
        <div className="font-term text-sm text-fg [&_li]:rounded-md [&_li]:border [&_li]:border-edge [&_li]:px-3.5 [&_li]:py-2 [&_ul]:m-0 [&_ul]:flex [&_ul]:list-none [&_ul]:flex-wrap [&_ul]:gap-2.5 [&_ul]:p-0">
            {children}
        </div>
    );
}

function Stats({children}: PWC) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
            {children}
        </div>
    );
}

function Stat({value, children}: PWC<{value: string}>) {
    return (
        <div className={clsx(panel, 'px-5 py-6')}>
            <p className="m-0 font-term text-4xl font-bold tracking-[-0.03em] text-accent">
                {value}
            </p>
            <div className="mt-1 text-sm text-soft">{children}</div>
        </div>
    );
}

// Grid of labelled cards, e.g. the stages of a pipeline.
function Cards({children}: PWC) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {children}
        </div>
    );
}

function Card({label, title, children}: PWC<{label?: string; title: string}>) {
    return (
        <div className={clsx(panel, 'flex flex-col gap-2 p-5')}>
            {label && <span className="font-term text-[13px] text-accent">{label}</span>}
            <span className="font-term text-lg font-bold text-fg">{title}</span>
            <div className="text-[15px] text-soft">{children}</div>
        </div>
    );
}

// Titled frame around a fenced code block.
function CodePanel({file, children}: PWC<{file: string}>) {
    return (
        <div className={clsx(panel, 'overflow-hidden')}>
            <div className="border-b border-line px-4 py-3 font-term text-xs text-muted">
                {file}
            </div>
            {children}
        </div>
    );
}

// Embedded live app.
function Demo({src, title, ratio = '16 / 9'}: {src: string; title?: string; ratio?: string}) {
    return (
        <iframe
            src={src}
            title={title ?? 'demo'}
            loading="lazy"
            style={{aspectRatio: ratio}}
            className={clsx(panel, 'w-full')}
        />
    );
}

export const contentMdxComponents = {
    Section,
    Big,
    Shot,
    Shots,
    Flow,
    Step,
    Arrow,
    Decisions,
    Decision,
    Chips,
    Stats,
    Stat,
    Cards,
    Card,
    CodePanel,
    Demo,
};

export const contentMdxComponentNames = Object.keys(contentMdxComponents);

export const contentProseClass = [
    '[&_p]:m-0',
    '[&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-accent',
    '[&_:not(pre)>code]:font-term [&_:not(pre)>code]:text-[0.9em] [&_:not(pre)>code]:text-accent',
    '[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:p-5 [&_pre]:font-term [&_pre]:text-sm [&_pre]:leading-[1.7]',
    '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
].join(' ');
