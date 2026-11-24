import React from 'react';

import {clsx} from 'clsx';

import '@/admin/css/github-dark.css';
import {encodeEmail} from '@/utils/email-obfuscate';

import {StaticBlockName} from './blocks/block-library';
import {ObfuscatedEmail} from './obfuscated-email';
import {buttonClass, CtaBanner, Prompt as PromptLine} from './site-parts';
import {SolverPanel} from './solver-panel';

import {Link} from '@/navigation';

// Static blocks of the block library (`blocks/block-library.ts`), available in
// all CMS content. Blocks fed from the database live in `content-mdx-dynamic.tsx`.
// Props are plain strings so they survive next-mdx-remote's JS blocking.

const panel = 'rounded-[10px] border border-line bg-panel';

// Two-column block: `# title` on the left, content on the right.
function Section({title, children}: PWC<{title: string}>) {
    return (
        <section className="flex flex-wrap gap-x-16 gap-y-4 pt-[clamp(48px,7vw,96px)]">
            <PromptLine as="h2" symbol="#" className="flex-[1_1_220px]">
                {title}
            </PromptLine>
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

export const sectionGap = 'pb-[clamp(64px,8vw,112px)]';

// Top of a page: <HeroIntro> next to a visual such as <Solver>.
function Hero({children}: PWC) {
    return (
        <section className="flex flex-wrap items-center gap-x-16 gap-y-12 pt-[clamp(40px,7vw,96px)] pb-[clamp(56px,8vw,112px)]">
            {children}
        </section>
    );
}

function HeroIntro({
    command,
    title,
    title2,
    children,
}: PWC<{command?: string; title: string; title2?: string}>) {
    return (
        <div className="flex min-w-0 flex-[3_1_440px] flex-col gap-7">
            {command && <PromptLine>{command}</PromptLine>}
            <h1 className="m-0 font-term text-[clamp(34px,5.2vw,72px)] leading-[1.08] font-bold tracking-[-0.03em]">
                {title}
                {title2 && (
                    <>
                        <br />
                        {title2}
                    </>
                )}
                <span className="text-accent">_</span>
            </h1>
            <div className="contents [&>p]:max-w-135 [&>p]:text-[clamp(17px,1.4vw,19px)] [&>p]:text-soft">
                {children}
            </div>
        </div>
    );
}

function Buttons({children}: PWC) {
    return <div className="flex flex-wrap gap-3">{children}</div>;
}

// Internal paths go through the localized router, anything else opens in a new tab.
function Button({href, variant, children}: PWC<{href: string; variant?: string}>) {
    const className =
        variant === 'primary' ? buttonClass.primary : buttonClass.secondary;

    if (href.startsWith('/')) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        );
    }
    return (
        <a href={href} target="_blank" rel="noreferrer" className={className}>
            {children}
        </a>
    );
}

function Solver(props: {label: string; status: string; alt: string; caption?: string}) {
    return <SolverPanel {...props} />;
}

// Row of columns; `id` makes the section a target of `/#id` links.
function Split({id, children}: PWC<{id?: string}>) {
    return (
        <section id={id} className={clsx('flex flex-wrap gap-x-16 gap-y-8', sectionGap)}>
            {children}
        </section>
    );
}

function Lead({command, children}: PWC<{command?: string}>) {
    return (
        <div className="flex min-w-0 flex-[3_1_400px] flex-col gap-5">
            {command && <PromptLine as="h2">{command}</PromptLine>}
            <div className="flex flex-col gap-5 text-[clamp(19px,2vw,26px)] leading-[1.4]">
                {children}
            </div>
        </div>
    );
}

// Code-like list: `label = ["a", "b"]`; `items` is comma-separated.
function Stack({label = 'stack', items = ''}: {label?: string; items?: string}) {
    const stack = items
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    if (!stack.length) {
        return null;
    }

    return (
        <div className="min-w-0 flex-[2_1_300px] self-start rounded-[10px] border border-line bg-panel p-6 font-term text-sm leading-[1.9]">
            <div>
                <span className="text-muted">{label}</span> = [
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
    );
}

const emailClass =
    'inline-block font-term text-[clamp(26px,4.6vw,60px)] leading-[1.1] font-bold tracking-[-0.03em] wrap-anywhere';

// Contact panel. The address is obfuscated in the HTML and decoded in the
// browser; `placeholder` stands in while `email` is empty.
function Contact({
    id,
    command,
    email,
    placeholder,
    children,
}: PWC<{id?: string; command?: string; email?: string; placeholder?: string}>) {
    return (
        <section
            id={id}
            className="rounded-[10px] border border-line bg-panel px-[clamp(20px,4vw,56px)] py-[clamp(40px,6vw,80px)]"
        >
            {command && <PromptLine className="mb-4">{command}</PromptLine>}
            {email ? (
                <ObfuscatedEmail
                    encoded={encodeEmail(email)}
                    className={clsx(emailClass, 'hover:text-accent')}
                />
            ) : (
                <span className={emailClass}>{placeholder}</span>
            )}
            <div className="mt-5 max-w-130 text-soft">{children}</div>
        </section>
    );
}

function Prompt({symbol, children}: PWC<{symbol?: string}>) {
    return <PromptLine symbol={symbol}>{children}</PromptLine>;
}

// Plain markdown as an article: headings, lists and paragraphs get spacing.
function Prose({children}: PWC) {
    return (
        <div className="flex max-w-190 flex-col gap-5 pt-[clamp(32px,5vw,64px)] text-soft [&_h1]:m-0 [&_h1]:font-term [&_h1]:text-[clamp(32px,4.6vw,64px)] [&_h1]:leading-[1.08] [&_h1]:font-bold [&_h1]:tracking-[-0.03em] [&_h1]:text-fg [&_h2]:m-0 [&_h2]:mt-6 [&_h2]:font-term [&_h2]:text-[clamp(22px,2.4vw,30px)] [&_h2]:font-bold [&_h2]:text-fg [&_h3]:m-0 [&_h3]:mt-2 [&_h3]:font-term [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-fg [&_li]:mt-1.5 [&_ol]:m-0 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-6">
            {children}
        </div>
    );
}

function Cta(props: {text: string; button: string; href: string}) {
    return <CtaBanner {...props} />;
}

export const contentMdxComponents = {
    Hero,
    HeroIntro,
    Buttons,
    Button,
    Solver,
    Split,
    Lead,
    Prompt,
    Prose,
    Cta,
    Stack,
    Contact,
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
} satisfies Record<StaticBlockName, React.ComponentType<any>>;

export const contentProseClass = [
    '[&_p]:m-0',
    // Links written in markdown; buttons and cards rendered by blocks keep their look.
    '[&_:is(p,li)>a]:underline [&_:is(p,li)>a]:underline-offset-4 [&_:is(p,li)>a:hover]:text-accent',
    '[&_:not(pre)>code]:font-term [&_:not(pre)>code]:text-[0.9em] [&_:not(pre)>code]:text-accent',
    '[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:p-5 [&_pre]:font-term [&_pre]:text-sm [&_pre]:leading-[1.7]',
    '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
].join(' ');
